import { bot } from './../../index';
import { i18n } from "../../utils/i18n"
import { canModifyQueue } from "../../utils/queue";
import { Message } from "discord.js"

export default {
    execute(message: Message) {
        const queue = bot.queues.get(message.guild!.id);
        const guildMemer = message.guild!.members.cache.get(message.author.id);

        if (!queue) return message.reply(i18n.__("skip.errorNotQueue")).catch(console.error);

        if (!canModifyQueue(guildMemer!)) return i18n.__("common.errorNotChannel");

        queue.player.stop(true);

        message.reply({ content: i18n.__mf("skip.result", { author: message.author.id }) }).catch(console.error);
    }
}