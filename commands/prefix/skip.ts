import { bot } from './../../index';
import { i18n } from "../../utils/i18n"
import { canModifyQueue } from "../../utils/queue";
import { GuildMember, Message } from "discord.js"
import { CommandType } from '../../interfaces/Command';

export default {
    data: {
        name: 'skip',
        type: CommandType.Music,
        description: i18n.__("skip.description"),
        fields: [
            {
                name: i18n.__("common.fieldsUse"),
                value: `**${bot.prefix}skip**`
            }
        ]
    },
    execute(message: Message, input: string, author: GuildMember | undefined) {
        const queue = bot.queues.get(message.guild!.id);
        if (author == undefined) author = message.guild!.members.cache.get(message.author.id);

        if (!queue) return message.reply(i18n.__("skip.errorNotQueue")).catch(console.error);
        if (!canModifyQueue(author!)) return i18n.__("common.errorNotChannel");

        queue.player.stop(true);

        message.reply({ content: i18n.__mf("skip.result", { author: author?.id }) }).catch(console.error);
    }
}