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
import { MusicQueuePrefix } from '../../structs/MusicQueuePrefix';
import { DiscordGatewayAdapterCreator, joinVoiceChannel } from '@discordjs/voice';
import { CommandType } from "../../interfaces/Command";

export default {
    data: {
        name: 'playlist',
        sname: 'pl',
        type: CommandType.Music,
        description: i18n.__("playlist.description"),
        fields: [
            {
                name: i18n.__("common.fieldsUse"),
                value: `• **${bot.prefix}playlist <url playlist>**` + '\n' +
                    `• **${bot.prefix}pl <url playlist>**` + '\n' +
                    i18n.__("playlist.usages")
            }
        ]
    },
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
            const newQueue = new MusicQueuePrefix({
                message,
                textChannel: message.channel! as TextChannel,
                connection: joinVoiceChannel({
                    channelId: channel.id,
                    guildId: channel.guild.id,
                    adapterCreator: channel.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator
                })
            });

            bot.queues.set(message.guild!.id, newQueue);
            newQueue.enqueue(...playlist.videos);
        }

        let playlistEmbed = new EmbedBuilder()
            .setTitle(`${playlist.data.title}`)
            .setDescription(playlist.videos.map((song: Song, index: number) => `${index + 1}. ${song.title}`).join("\n").slice(0, 4095))
            .setURL(playlist.data.url!)
            .setColor(randomColor())
            .setTimestamp();

        message
            .reply({
                content: i18n.__mf("playlist.startedPlaylist", { author: message.author.id }),
                embeds: [playlistEmbed]
            })
            .catch(console.error);
    }
}