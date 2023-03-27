import {
    ActionRowBuilder,
    ChatInputCommandInteraction,
    CommandInteraction,
    EmbedBuilder,
    MessageReaction,
    StringSelectMenuBuilder,
    StringSelectMenuInteraction,
    TextChannel,
    User
} from "discord.js";
import move from "array-move";
import { bot } from '../../index';
import { i18n } from "../../utils/i18n";
// @ts-ignore
import lyricsFinder from "lyrics-finder";
import { Song } from '../../structs/Song';
import youtube, { Video } from 'youtube-sr';
import { splitBar } from "string-progressbar";
import { randomColor } from "../../utils/color";
import { Playlist } from '../../structs/Playlist';
import { canModifyQueue } from '../../utils/queue';
import { DiscordGatewayAdapterCreator, joinVoiceChannel } from '@discordjs/voice';
import { MusicQueue } from '../../structs/MusicQueue';
import { playlistPattern } from '../../utils/patterns';

const pattern = /^[0-9]{1,2}(\s*,\s*[0-9]{1,2})*$/;

function setLoop(interaction: ChatInputCommandInteraction) {
    const queue = bot.queues.get(interaction.guild!.id);
    const guildMemer = interaction.guild!.members.cache.get(interaction.user.id);

    if (!queue)
        return interaction.reply({ content: i18n.__("loop.errorNotQueue"), ephemeral: true }).catch(console.error);

    if (!guildMemer || !canModifyQueue(guildMemer)) return i18n.__("common.errorNotChannel");

    queue.loop = !queue.loop;

    const content = {
        content: i18n.__mf("loop.result", { loop: queue.loop ? i18n.__("common.on") : i18n.__("common.off") })
    };

    if (interaction.replied) interaction.followUp(content).catch(console.error);
    else interaction.reply(content).catch(console.error);
}

async function setLyrics(interaction: ChatInputCommandInteraction) {
    const queue = bot.queues.get(interaction.guild!.id);

    if (!queue || !queue.songs.length) return i18n.__("lyrics.errorNotQueue")

    await interaction.reply("⏳ Loading...").catch(console.error);

    let lyrics = null;
    const title = queue.songs[0].title;

    try {
        lyrics = await lyricsFinder(queue.songs[0].title, "");
        if (!lyrics) lyrics = i18n.__mf("lyrics.lyricsNotFound", { title: title });
    } catch (error) {
        lyrics = i18n.__mf("lyrics.lyricsNotFound", { title: title });
    }

    let lyricsEmbed = new EmbedBuilder()
        .setTitle(i18n.__mf("lyrics.embedTitle", { title: title }))
        .setDescription(lyrics.length >= 4096 ? `${lyrics.substr(0, 4093)}...` : lyrics)
        .setColor(randomColor())
        .setTimestamp();

    return interaction.editReply({ content: "", embeds: [lyricsEmbed] }).catch(console.error);
}

function setMove(interaction: ChatInputCommandInteraction) {
    const movefromArg = interaction.options.getInteger("movefrom");
    const movetoArg = interaction.options.getInteger("moveto");

    const guildMemer = interaction.guild!.members.cache.get(interaction.user.id);
    const queue = bot.queues.get(interaction.guild!.id);

    if (!queue) return interaction.reply(i18n.__("move.errorNotQueue")).catch(console.error);

    if (!canModifyQueue(guildMemer!)) return;

    if (!movefromArg || !movetoArg)
        return interaction.reply({ content: i18n.__mf("move.usagesReply", { prefix: bot.prefix }), ephemeral: true });

    if (isNaN(movefromArg) || movefromArg <= 1)
        return interaction.reply({ content: i18n.__mf("move.usagesReply", { prefix: bot.prefix }), ephemeral: true });

    let song = queue.songs[movefromArg - 1];

    queue.songs = move(queue.songs, movefromArg - 1, movetoArg == 1 ? 1 : movetoArg - 1);

    interaction.reply({
        content: i18n.__mf("move.result", {
            author: interaction.user.id,
            title: song.title,
            index: movetoArg == 1 ? 1 : movetoArg
        })
    });
}

function setNowPlaying(interaction: ChatInputCommandInteraction) {
    const queue = bot.queues.get(interaction.guild!.id);

    if (!queue || !queue.songs.length)
        return interaction.reply({ content: i18n.__("nowplaying.errorNotQueue"), ephemeral: true }).catch(console.error);

    const song = queue.songs[0];
    const seek = queue.resource.playbackDuration / 1000;
    const left = song.duration - seek;

    let nowPlaying = new EmbedBuilder()
        .setTitle(i18n.__("nowplaying.embedTitle"))
        .setDescription(`${song.title}\n${song.url}`)
        .setColor(randomColor());

    if (song.duration > 0) {
        nowPlaying.addFields({
            name: "\u200b",
            value:
                new Date(seek * 1000).toISOString().substr(11, 8) +
                "[" +
                splitBar(song.duration == 0 ? seek : song.duration, seek, 20)[0] +
                "]" +
                (song.duration == 0 ? " ◉ LIVE" : new Date(song.duration * 1000).toISOString().substr(11, 8)),
            inline: false
        });

        nowPlaying.setFooter({
            text: i18n.__mf("nowplaying.timeRemaining", {
                time: new Date(left * 1000).toISOString().substr(11, 8)
            })
        });
    }

    return interaction.reply({ embeds: [nowPlaying] });
}

function setPause(interaction: ChatInputCommandInteraction) {
    const guildMemer = interaction.guild!.members.cache.get(interaction.user.id);
    const queue = bot.queues.get(interaction.guild!.id);

    if (!queue) return interaction.reply({ content: i18n.__("pause.errorNotQueue") }).catch(console.error);

    if (!canModifyQueue(guildMemer!)) return i18n.__("common.errorNotChannel");

    if (queue.player.pause()) {
        const content = { content: i18n.__mf("pause.result", { author: interaction.user.id }) };

        if (interaction.replied) interaction.followUp(content).catch(console.error);
        else interaction.reply(content).catch(console.error);

        return true;
    }
}

async function setPlay(interaction: ChatInputCommandInteraction, input: string) {
    let argSongName = interaction.options.getString("song");
    if (!argSongName) argSongName = input;

    const guildMember = interaction.guild!.members.cache.get(interaction.user.id);
    const { channel } = guildMember!.voice;

    if (!channel)
        return interaction.reply({ content: i18n.__("play.errorNotChannel"), ephemeral: true }).catch(console.error);

    const queue = bot.queues.get(interaction.guild!.id);

    if (queue && channel.id !== queue.connection.joinConfig.channelId)
        return interaction
            .reply({
                content: i18n.__mf("play.errorNotInSameChannel", { user: bot.client.user!.username }),
                ephemeral: true
            })
            .catch(console.error);

    if (!argSongName)
        return interaction
            .reply({ content: i18n.__mf("play.usageReply", { prefix: bot.prefix }), ephemeral: true })
            .catch(console.error);

    const url = argSongName;

    if (interaction.replied) await interaction.editReply("⏳ Loading...").catch(console.error);
    else await interaction.reply("⏳ Loading...");

    // Start the playlist if playlist url was provided
    if (playlistPattern.test(url)) {
        await interaction.editReply("🔗 Link is playlist").catch(console.error);

        return bot.slashCommandsMap.get("playlist")!.execute(interaction);
    }

    let song;

    try {
        song = await Song.from(url, url);
    } catch (error: any) {
        if (error.name == "NoResults")
            return interaction
                .reply({ content: i18n.__mf("play.errorNoResults", { url: `<${url}>` }), ephemeral: true })
                .catch(console.error);
        if (error.name == "InvalidURL")
            return interaction
                .reply({ content: i18n.__mf("play.errorInvalidURL", { url: `<${url}>` }), ephemeral: true })
                .catch(console.error);

        console.error(error);
        if (interaction.replied)
            return await interaction.editReply({ content: i18n.__("common.errorCommand") }).catch(console.error);
        else return interaction.reply({ content: i18n.__("common.errorCommand"), ephemeral: true }).catch(console.error);
    }

    if (queue) {
        queue.enqueue(song);

        return (interaction.channel as TextChannel)
            .send({ content: i18n.__mf("play.queueAdded", { title: song.title, author: interaction.user.id }) })
            .catch(console.error);
    }

    const newQueue = new MusicQueue({
        interaction,
        textChannel: interaction.channel! as TextChannel,
        connection: joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator
        })
    });

    bot.queues.set(interaction.guild!.id, newQueue);

    newQueue.enqueue(song);
    interaction.deleteReply().catch(console.error);
}

async function setPlayList(interaction: ChatInputCommandInteraction) {
    let argSongName = interaction.options.getString("playlist");

    const guildMemer = interaction.guild!.members.cache.get(interaction.user.id);
    const { channel } = guildMemer!.voice;

    const queue = bot.queues.get(interaction.guild!.id);

    if (!channel)
        return interaction.reply({ content: i18n.__("playlist.errorNotChannel"), ephemeral: true }).catch(console.error);

    if (queue && channel.id !== queue.connection.joinConfig.channelId)
        if (interaction.replied)
            return interaction
                .editReply({ content: i18n.__mf("play.errorNotInSameChannel", { user: interaction.client.user!.username }) })
                .catch(console.error);
        else
            return interaction
                .reply({
                    content: i18n.__mf("play.errorNotInSameChannel", { user: interaction.client.user!.username }),
                    ephemeral: true
                })
                .catch(console.error);

    let playlist;

    try {
        playlist = await Playlist.from(argSongName!.split(" ")[0], argSongName!);
    } catch (error) {
        console.error(error);

        if (interaction.replied)
            return interaction.editReply({ content: i18n.__("playlist.errorNotFoundPlaylist") }).catch(console.error);
        else
            return interaction
                .reply({ content: i18n.__("playlist.errorNotFoundPlaylist"), ephemeral: true })
                .catch(console.error);
    }

    if (queue) {
        queue.songs.push(...playlist.videos);
    } else {
        const newQueue = new MusicQueue({
            interaction,
            textChannel: interaction.channel! as TextChannel,
            connection: joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator
            })
        });

        bot.queues.set(interaction.guild!.id, newQueue);
        newQueue.songs.push(...playlist.videos);

        newQueue.enqueue(playlist.videos[0]);
    }

    let playlistEmbed = new EmbedBuilder()
        .setTitle(`${playlist.data.title}`)
        .setDescription(playlist.videos.map((song: Song, index: number) => `${index + 1}. ${song.title}`).join("\n"))
        .setURL(playlist.data.url!)
        .setColor(randomColor())
        .setTimestamp();

    if (playlistEmbed.data.description!.length >= 2048)
        playlistEmbed.setDescription(
            playlistEmbed.data.description!.substr(0, 2007) + i18n.__("playlist.playlistCharLimit")
        );

    if (interaction.replied)
        return interaction.editReply({
            content: i18n.__mf("playlist.startedPlaylist", { author: interaction.user.id }),
            embeds: [playlistEmbed]
        });
    interaction
        .reply({
            content: i18n.__mf("playlist.startedPlaylist", { author: interaction.user.id }),
            embeds: [playlistEmbed]
        })
        .catch(console.error);
}

function generateQueueEmbed(interaction: CommandInteraction, songs: Song[]) {
    let embeds = [];
    let k = 10;

    for (let i = 0; i < songs.length; i += 10) {
        const current = songs.slice(i, k);
        let j = i;
        k += 10;

        const info = current.map((track) => `${++j} - [${track.title}](${track.url})`).join("\n");

        const embed = new EmbedBuilder()
            .setTitle(i18n.__("queue.embedTitle"))
            .setThumbnail(interaction.guild?.iconURL()!)
            .setColor(randomColor())
            .setDescription(i18n.__mf("queue.embedCurrentSong", { title: songs[0].title, url: songs[0].url, info: info }))
            .setTimestamp();
        embeds.push(embed);
    }

    return embeds;
}

async function setQueue(interaction: ChatInputCommandInteraction) {
    const queue = bot.queues.get(interaction.guild!.id);
    if (!queue || !queue.songs.length) return interaction.reply({ content: i18n.__("queue.errorNotQueue") });

    let currentPage = 0;
    const embeds = generateQueueEmbed(interaction, queue.songs);

    await interaction.reply("⏳ Loading queue...");

    if (interaction.replied)
        await interaction.editReply({
            content: `**${i18n.__mf("queue.currentPage")} ${currentPage + 1}/${embeds.length}**`,
            embeds: [embeds[currentPage]]
        });

    const queueEmbed = await interaction.fetchReply();

    try {
        await queueEmbed.react("⬅️");
        await queueEmbed.react("⏹");
        await queueEmbed.react("➡️");
    } catch (error: any) {
        console.error(error);
        (interaction.channel as TextChannel).send(error.message).catch(console.error);
    }

    const filter = (reaction: MessageReaction, user: User) =>
        ["⬅️", "⏹", "➡️"].includes(reaction.emoji.name!) && interaction.user.id === user.id;

    const collector = queueEmbed.createReactionCollector({ filter, time: 60000 });

    collector.on("collect", async (reaction, user) => {
        try {
            if (reaction.emoji.name === "➡️") {
                if (currentPage < embeds.length - 1) {
                    currentPage++;
                    queueEmbed.edit({
                        content: i18n.__mf("queue.currentPage", { page: currentPage + 1, length: embeds.length }),
                        embeds: [embeds[currentPage]]
                    });
                }
            } else if (reaction.emoji.name === "⬅️") {
                if (currentPage !== 0) {
                    --currentPage;
                    queueEmbed.edit({
                        content: i18n.__mf("queue.currentPage", { page: currentPage + 1, length: embeds.length }),
                        embeds: [embeds[currentPage]]
                    });
                }
            } else {
                collector.stop();
                reaction.message.reactions.removeAll();
            }
            await reaction.users.remove(interaction.user.id);
        } catch (error: any) {
            console.error(error);
            return (interaction.channel as TextChannel).send(error.message).catch(console.error);
        }
    });
}

function setRemove(interaction: ChatInputCommandInteraction) {
    const guildMemer = interaction.guild!.members.cache.get(interaction.user.id);
    const removeArgs = interaction.options.getString("slot");

    const queue = bot.queues.get(interaction.guild!.id);

    if (!queue)
        return interaction.reply({ content: i18n.__("remove.errorNotQueue"), ephemeral: true }).catch(console.error);

    if (!canModifyQueue(guildMemer!)) return i18n.__("common.errorNotChannel");

    if (!removeArgs)
        return interaction.reply({ content: i18n.__mf("remove.usageReply", { prefix: bot.prefix }), ephemeral: true });

    const songs = removeArgs.split(",").map((arg: any) => parseInt(arg));

    let removed: Song[] = [];

    if (pattern.test(removeArgs)) {
        queue.songs = queue.songs.filter((item, index) => {
            if (songs.find((songIndex: any) => songIndex - 1 === index)) removed.push(item);
            else return true;
        });

        interaction.reply(
            i18n.__mf("remove.result", {
                title: removed.map((song) => song.title).join("\n"),
                author: interaction.user.id
            })
        );
    } else if (!isNaN(+removeArgs) && +removeArgs >= 1 && +removeArgs <= queue.songs.length) {
        return interaction.reply(
            i18n.__mf("remove.result", {
                title: queue.songs.splice(+removeArgs - 1, 1)[0].title,
                author: interaction.user.id
            })
        );
    } else {
        return interaction.reply({ content: i18n.__mf("remove.usageReply", { prefix: bot.prefix }) });
    }
}

function setResume(interaction: ChatInputCommandInteraction) {
    const queue = bot.queues.get(interaction.guild!.id);
    const guildMemer = interaction.guild!.members.cache.get(interaction.user.id);

    if (!queue)
        return interaction.reply({ content: i18n.__("resume.errorNotQueue"), ephemeral: true }).catch(console.error);

    if (!canModifyQueue(guildMemer!)) return i18n.__("common.errorNotChannel");

    if (queue.player.unpause()) {
        const content = { content: i18n.__mf("resume.resultNotPlaying", { author: interaction.user.id }) };

        if (interaction.replied) interaction.followUp(content).catch(console.error);
        else interaction.reply(content).catch(console.error);

        return true;
    }

    const content = { content: i18n.__("resume.errorPlaying") };

    if (interaction.replied) interaction.followUp(content).catch(console.error);
    else interaction.reply(content).catch(console.error);
    return false;
}

async function setSearch(interaction: ChatInputCommandInteraction) {
    const query = interaction.options.getString("query", true);
    const member = interaction.guild!.members.cache.get(interaction.user.id);

    if (!member?.voice.channel)
        return interaction.reply({ content: i18n.__("search.errorNotChannel"), ephemeral: true }).catch(console.error);

    const search = query;

    await interaction.reply("⏳ Loading...").catch(console.error);

    let results: Video[] = [];

    try {
        results = await youtube.search(search, { limit: 10, type: "video" });
    } catch (error: any) {
        console.error(error);

        interaction.editReply({ content: i18n.__("common.errorCommand") }).catch(console.error);
    }

    if (!results) return;

    const options = results!.map((video) => {
        return {
            label: video.title ?? "",
            value: video.url
        };
    });

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId("search-select")
            .setPlaceholder("Nothing selected")
            .setMinValues(1)
            .setMaxValues(10)
            .addOptions(options)
    );

    const followUp = await interaction.followUp({
        content: "Choose songs to play",
        components: [row]
    });

    followUp
        .awaitMessageComponent({
            time: 30000
        })
        .then((selectInteraction) => {
            if (!(selectInteraction instanceof StringSelectMenuInteraction)) return;

            selectInteraction.update({ content: "⏳ Loading the selected songs...", components: [] });

            bot.slashCommandsMap
                .get("play")!
                .execute(interaction, selectInteraction.values[0])
                .then(() => {
                    selectInteraction.values.slice(1).forEach((url) => {
                        bot.slashCommandsMap.get("play")!.execute(interaction, url);
                    });
                });
        })
        .catch(console.error);
}

function setShuffle(interaction: ChatInputCommandInteraction) {
    const queue = bot.queues.get(interaction.guild!.id);
    const guildMemer = interaction.guild!.members.cache.get(interaction.user.id);

    if (!queue)
        return interaction.reply({ content: i18n.__("shuffle.errorNotQueue"), ephemeral: true }).catch(console.error);

    if (!guildMemer || !canModifyQueue(guildMemer)) return i18n.__("common.errorNotChannel");

    let songs = queue.songs;

    for (let i = songs.length - 1; i > 1; i--) {
        let j = 1 + Math.floor(Math.random() * i);
        [songs[i], songs[j]] = [songs[j], songs[i]];
    }

    queue.songs = songs;

    const content = { content: i18n.__mf("shuffle.result", { author: interaction.user.id }) };

    if (interaction.replied) interaction.followUp(content).catch(console.error);
    else interaction.reply(content).catch(console.error);
}

function setSkip(interaction: ChatInputCommandInteraction) {
    const queue = bot.queues.get(interaction.guild!.id);
    const guildMemer = interaction.guild!.members.cache.get(interaction.user.id);

    if (!queue) return interaction.reply(i18n.__("skip.errorNotQueue")).catch(console.error);

    if (!canModifyQueue(guildMemer!)) return i18n.__("common.errorNotChannel");

    queue.player.stop(true);

    interaction.reply({ content: i18n.__mf("skip.result", { author: interaction.user.id }) }).catch(console.error);
}

function setSkipto(interaction: ChatInputCommandInteraction) {
    const playlistSlotArg = interaction.options.getInteger("number");
    const guildMemer = interaction.guild!.members.cache.get(interaction.user.id);

    if (!playlistSlotArg || isNaN(playlistSlotArg))
        return interaction
            .reply({
                content: i18n.__mf("skipto.usageReply", { prefix: bot.prefix, name: module.exports.name }),
                ephemeral: true
            })
            .catch(console.error);

    const queue = bot.queues.get(interaction.guild!.id);

    if (!queue)
        return interaction.reply({ content: i18n.__("skipto.errorNotQueue"), ephemeral: true }).catch(console.error);

    if (!canModifyQueue(guildMemer!)) return i18n.__("common.errorNotChannel");

    if (playlistSlotArg > queue.songs.length)
        return interaction
            .reply({ content: i18n.__mf("skipto.errorNotValid", { length: queue.songs.length }), ephemeral: true })
            .catch(console.error);

    if (queue.loop) {
        for (let i = 0; i < playlistSlotArg - 2; i++) {
            queue.songs.push(queue.songs.shift()!);
        }
    } else {
        queue.songs = queue.songs.slice(playlistSlotArg - 2);
    }

    queue.player.stop();

    interaction
        .reply({ content: i18n.__mf("skipto.result", { author: interaction.user.id, arg: playlistSlotArg - 1 }) })
        .catch(console.error);
}

function setStop(interaction: ChatInputCommandInteraction) {
    const queue = bot.queues.get(interaction.guild!.id);
    const guildMemer = interaction.guild!.members.cache.get(interaction.user.id);

    if (!queue) return interaction.reply(i18n.__("stop.errorNotQueue")).catch(console.error);
    if (!guildMemer || !canModifyQueue(guildMemer)) return i18n.__("common.errorNotChannel");

    queue.stop();

    interaction.reply({ content: i18n.__mf("stop.result", { author: interaction.user.id }) }).catch(console.error);
}

function setVolume(interaction: ChatInputCommandInteraction) {
    const queue = bot.queues.get(interaction.guild!.id);
    const guildMemer = interaction.guild!.members.cache.get(interaction.user.id);
    const volumeArg = interaction.options.getInteger("volume");

    if (!queue)
        return interaction.reply({ content: i18n.__("volume.errorNotQueue"), ephemeral: true }).catch(console.error);

    if (!canModifyQueue(guildMemer!))
        return interaction.reply({ content: i18n.__("volume.errorNotChannel"), ephemeral: true }).catch(console.error);

    if (!volumeArg || volumeArg === queue.volume)
        return interaction
            .reply({ content: i18n.__mf("volume.currentVolume", { volume: queue.volume }) })
            .catch(console.error);

    if (isNaN(volumeArg))
        return interaction.reply({ content: i18n.__("volume.errorNotNumber"), ephemeral: true }).catch(console.error);

    if (Number(volumeArg) > 100 || Number(volumeArg) < 0)
        return interaction.reply({ content: i18n.__("volume.errorNotValid"), ephemeral: true }).catch(console.error);

    queue.volume = volumeArg;
    queue.resource.volume?.setVolumeLogarithmic(volumeArg / 100);

    return interaction.reply({ content: i18n.__mf("volume.result", { arg: volumeArg }) }).catch(console.error);
}

export {
    setLoop,
    setLyrics,
    setMove,
    setNowPlaying,
    setPause,
    setPlay,
    setPlayList,
    setQueue,
    setRemove,
    setResume,
    setSearch,
    setShuffle,
    setSkip,
    setSkipto,
    setStop,
    setVolume
}