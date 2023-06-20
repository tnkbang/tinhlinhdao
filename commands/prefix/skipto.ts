import { bot } from './../../index';
import { i18n } from "../../utils/i18n"
import { canModifyQueue } from "../../utils/queue";
import { Message } from "discord.js"
import { CommandType } from '../../interfaces/Command';

export default {
    data: {
        name: 'skipto',
        sname: 'st',
        type: CommandType.Music,
        description: i18n.__("skipto.description"),
        fields: [
            {
                name: i18n.__("common.fieldsUse"),
                value: `• **${bot.prefix}skipto <id>**` + '\n' +
                    `• **${bot.prefix}st <id>**` + '\n' +
                    `• **<id>** ` + i18n.__("skipto.usage")
            }
        ]
    },
    execute(message: Message, input: string) {
        if (!input) return message.reply({ content: i18n.__("skipto.errorInput") }).catch(console.error)
        const playlistSlotArg = Number.parseInt(input)
        const guildMemer = message.guild!.members.cache.get(message.author.id);

        if (!playlistSlotArg || isNaN(playlistSlotArg))
            return message
                .reply({
                    content: i18n.__mf("skipto.usageReply", { prefix: bot.prefix, name: module.exports.name })
                })
                .catch(console.error);

        const queue = bot.queues.get(message.guild!.id);

        if (!queue)
            return message.reply({ content: i18n.__("skipto.errorNotQueue") }).catch(console.error);

        if (!canModifyQueue(guildMemer!)) return i18n.__("common.errorNotChannel");

        if (playlistSlotArg > queue.songs.length)
            return message
                .reply({ content: i18n.__mf("skipto.errorNotValid", { length: queue.songs.length }) })
                .catch(console.error);

        if (queue.loop) {
            for (let i = 0; i < playlistSlotArg - 2; i++) {
                queue.songs.push(queue.songs.shift()!);
            }
        } else {
            queue.songs = queue.songs.slice(playlistSlotArg - 2);
        }

        queue.player.stop();

        message
            .reply({ content: i18n.__mf("skipto.result", { author: message.author.id, arg: playlistSlotArg }) })
            .catch(console.error);
    }
}