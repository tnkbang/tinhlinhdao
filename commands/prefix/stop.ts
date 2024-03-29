import { bot } from './../../index';
import { i18n } from "../../utils/i18n";
import { canModifyQueue } from "../../utils/queue";
import { GuildMember, Message } from "discord.js";
import { CommandType } from '../../interfaces/Command';

export default {
    data: {
        name: 'stop',
        type: CommandType.Music,
        description: i18n.__("stop.description"),
        fields: [
            {
                name: i18n.__("common.fieldsUse"),
                value: `**${bot.prefix}stop**`
            }
        ]
    },
    execute(message: Message, input: string, author: GuildMember | undefined, isReact: boolean = false) {
        const queue = bot.queues.get(message.guild!.id);
        if (author == undefined) author = message.guild!.members.cache.get(message.author.id);

        if (!queue) return message.reply(i18n.__("stop.errorNotQueue")).catch(console.error);
        if (!author || !canModifyQueue(author)) return i18n.__("common.errorNotChannel");

        queue.stop();

        if (!isReact)
            message.reply({ content: i18n.__mf("stop.result", { author: author.id }) }).catch(console.error);
    }
}