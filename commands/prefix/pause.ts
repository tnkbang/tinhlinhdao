import { bot } from './../../index';
import { i18n } from "../../utils/i18n";
import { canModifyQueue } from "../../utils/queue";
import { GuildMember, Message } from "discord.js";

export default {
    async execute(message: Message, author: GuildMember | undefined) {
        const queue = bot.queues.get(message.guild!.id);
        if (author == undefined) author = message.guild!.members.cache.get(message.author.id);

        if (!queue) return message.reply({ content: i18n.__("pause.errorNotQueue") }).catch(console.error);
        if (!canModifyQueue(author!)) return i18n.__("common.errorNotChannel");

        if (queue.player.pause()) {
            let content = { content: i18n.__mf("pause.result", { author: author?.id }) };
            await message.reply(content).catch(console.error);

            return true
        }
    }
}