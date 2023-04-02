import { bot } from './../../index';
import { i18n } from "../../utils/i18n"
import { canModifyQueue } from "../../utils/queue";
import { GuildMember, Message } from "discord.js"

export default {
    execute(message: Message, author: GuildMember | undefined) {
        const queue = bot.queues.get(message.guild!.id);
        if (author == undefined) author = message.guild!.members.cache.get(message.author.id);

        if (!queue) return message.reply(i18n.__("skip.errorNotQueue")).catch(console.error);
        if (!canModifyQueue(author!)) return i18n.__("common.errorNotChannel");

        queue.player.stop(true);

        message.reply({ content: i18n.__mf("skip.result", { author: author?.id }) }).catch(console.error);
    }
}