import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    PermissionsBitField,
    SlashCommandBuilder,
    TextChannel
} from "discord.js";
import { bot } from './../../index';
import { i18n } from "../../utils/i18n";
import { Song } from '../../structs/Song';
import { randomColor } from "../../utils/color";
import { Playlist } from '../../structs/Playlist';
import { MusicQueue } from '../../structs/MusicQueue';
import { DiscordGatewayAdapterCreator, joinVoiceChannel } from '@discordjs/voice';

export default {
    data: new SlashCommandBuilder()
        .setName("playlist")
        .setDescription(i18n.__("playlist.description"))
        .addStringOption((option) => option.setName("playlist").setDescription("Playlist name or link").setRequired(true)),
    cooldown: 5,
    permissions: [
        PermissionsBitField.Flags.Connect,
        PermissionsBitField.Flags.Speak,
        PermissionsBitField.Flags.AddReactions,
        PermissionsBitField.Flags.ManageMessages
    ],
    async execute(interaction: ChatInputCommandInteraction, queryOptionName = 'playlist') {
        let argSongName = interaction.options.getString(queryOptionName);

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
            newQueue.enqueue(...playlist.videos);
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
}