import { bot } from './../../index';
import { i18n } from "../../utils/i18n";
import { canModifyQueue } from "../../utils/queue";
import { GuildMember, Message } from "discord.js";

export default {
    async execute(message: Message, guildID: string, guildMember: GuildMember | undefined) {
        let guildMemer;
        if (guildMember != undefined) guildMemer = guildMember
        else guildMemer = await message.guild!.members.fetch(message.author.id);

        const queue = bot.queues.get(guildID);

        if (!queue) return message.reply({ content: i18n.__("pause.errorNotQueue") }).catch(console.error);

        if (!canModifyQueue(guildMemer!)) return i18n.__("common.errorNotChannel");

        if (queue.player.pause()) {
            if (guildMember != undefined) return true

            let content = { content: i18n.__mf("pause.result", { author: message.author.id }) };
            message.reply(content).catch(console.error);

            return true
        }
    }
}