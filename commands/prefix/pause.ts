import { bot } from './../../index';
import { i18n } from "../../utils/i18n";
import { canModifyQueue } from "../../utils/queue";
import { Message } from "discord.js";

export default {
    async execute(message: Message) {
        const queue = bot.queues.get(message.guild!.id);
        const guildMemer = message.guild!.members.cache.get(message.author.id);

        if (!queue) return message.reply({ content: i18n.__("pause.errorNotQueue") }).catch(console.error);

        if (!canModifyQueue(guildMemer!)) return i18n.__("common.errorNotChannel");

        if (queue.player.pause()) {
            let content = { content: i18n.__mf("pause.result", { author: message.author.id }) };
            await message.reply(content).catch(console.error);

            return true
        }
    }
}