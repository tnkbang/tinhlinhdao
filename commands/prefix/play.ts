import {
    Message,
    TextChannel
} from "discord.js";
import { bot } from './../../index';
import { i18n } from "../../utils/i18n";
import { Song } from '../../structs/Song';
import { playlistPattern } from '../../utils/patterns';
import { MusicQueuePrefix } from "../../structs/MusicQueuePrefix";
import { DiscordGatewayAdapterCreator, joinVoiceChannel } from '@discordjs/voice';
import playlist from "./playlist";

export default {
    data: { name: 'play', sname: 'p', type: 'music' },
    async execute(message: Message, input: string, isSearch: boolean = false) {
        let argSongName = input;

        const guildMember = message.guild!.members.cache.get(message.author.id);
        const { channel } = guildMember!.voice;

        if (!channel)
            return message.reply({ content: i18n.__("play.errorNotChannel") }).catch(console.error);

        const queue = bot.queues.get(message.guild!.id);

        if (queue && channel.id !== queue.connection.joinConfig.channelId)
            return message
                .reply({
                    content: i18n.__mf("play.errorNotInSameChannel", { user: bot.client.user!.username })
                })
                .catch(console.error);

        if (!argSongName)
            return message
                .reply({ content: i18n.__mf("play.usageReply", { prefix: bot.prefix }) })
                .catch(console.error);

        const url = argSongName;

        if (!isSearch) {
            await message.react('⏳').catch(console.error)
        }

        // Start the playlist if playlist url was provided
        if (playlistPattern.test(url)) {
            await message.react('🔗').catch(console.error)

            const arrMsg = message.content.split(' ')
            return playlist.execute(message, message.content.replace(arrMsg[0], '').trim())
        }

        let song;

        try {
            song = await Song.from(url, url);
        } catch (error: any) {
            if (error.name == "NoResults")
                return message
                    .reply({ content: i18n.__mf("play.errorNoResults", { url: `<${url}>` }) })
                    .catch(console.error);
            if (error.name == "InvalidURL")
                return message
                    .reply({ content: i18n.__mf("play.errorInvalidURL", { url: `<${url}>` }) })
                    .catch(console.error);

            console.error(error);
            return message.reply({ content: i18n.__("common.errorCommand") }).catch(console.error);
        }

        if (queue) {
            queue.enqueue(song);

            return (message.channel as TextChannel)
                .send({ content: i18n.__mf("play.queueAdded", { title: song.title, author: message.author.id }) })
                .catch(console.error);
        }

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

        newQueue.enqueue(song);
    }
}