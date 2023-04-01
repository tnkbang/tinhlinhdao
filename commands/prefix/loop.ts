import { bot } from './../../index';
import { i18n } from "../../utils/i18n";
import { canModifyQueue } from '../../utils/queue';
import { Message } from "discord.js";

export default {
    execute(message: Message) {
        const queue = bot.queues.get(message.guild!.id);
        const guildMemer = message.guild!.members.cache.get(message.author.id);

        if (!queue)
            return message.reply({ content: i18n.__("loop.errorNotQueue") }).catch(console.error);

        if (!guildMemer || !canModifyQueue(guildMemer)) return i18n.__("common.errorNotChannel");

        queue.loop = !queue.loop;

        const content = {
            content: i18n.__mf("loop.result", { loop: queue.loop ? i18n.__("common.on") : i18n.__("common.off") })
        };

        message.reply(content).catch(console.error);
    }
}