import { bot } from './../../index';
import { i18n } from "../../utils/i18n";
import { canModifyQueue } from '../../utils/queue';
import { Message } from "discord.js";

export default {
    execute(message: Message) {
        const queue = bot.queues.get(message.guild!.id);
        const guildMemer = message.guild!.members.cache.get(message.author.id);

        if (!queue)
            return message.reply({ content: i18n.__("shuffle.errorNotQueue") }).catch(console.error);

        if (!guildMemer || !canModifyQueue(guildMemer)) return i18n.__("common.errorNotChannel");

        let songs = queue.songs;

        for (let i = songs.length - 1; i > 1; i--) {
            let j = 1 + Math.floor(Math.random() * i);
            [songs[i], songs[j]] = [songs[j], songs[i]];
        }

        queue.songs = songs;

        const content = { content: i18n.__mf("shuffle.result", { author: message.author.id }) };

        message.reply(content).catch(console.error);
    }
}