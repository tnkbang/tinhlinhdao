import {
    EmbedBuilder,
    Message,
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
    async execute(message: Message, input: string) {
        if (!input) return message.reply({ content: i18n.__("playlist.errorInput") }).catch(console.error)
        let argSongName = input

        const guildMemer = message.guild!.members.cache.get(message.author.id);
        const { channel } = guildMemer!.voice;

        const queue = bot.queues.get(message.guild!.id);

        if (!channel)
            return message.reply({ content: i18n.__("playlist.errorNotChannel") }).catch(console.error);

        if (queue && channel.id !== queue.connection.joinConfig.channelId)
            return message
                .reply({
                    content: i18n.__mf("play.errorNotInSameChannel", { user: message.client.user!.username })
                })
                .catch(console.error);

        let playlist;

        try {
            playlist = await Playlist.from(argSongName!.split(" ")[0], argSongName!);
        } catch (error) {
            console.error(error);

            return message
                .reply({ content: i18n.__("playlist.errorNotFoundPlaylist") })
                .catch(console.error);
        }

        if (queue) {
            queue.songs.push(...playlist.videos);
        } else {
            const interaction = message
            const newQueue = new MusicQueue({
                interaction,
                textChannel: message.channel! as TextChannel,
                connection: joinVoiceChannel({
                    channelId: channel.id,
                    guildId: channel.guild.id,
                    adapterCreator: channel.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator
                })
            });

            bot.queues.set(message.guild!.id, newQueue);
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

        message
            .reply({
                content: i18n.__mf("playlist.startedPlaylist", { author: message.author.id }),
                embeds: [playlistEmbed]
            })
            .catch(console.error);
    }
}