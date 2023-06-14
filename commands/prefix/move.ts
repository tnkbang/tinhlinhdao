import move from "array-move";
import { bot } from './../../index';
import { i18n } from "../../utils/i18n";
import { canModifyQueue } from "../../utils/queue";
import { Message } from "discord.js";

export default {
    data: { name: 'move', sname: 'm', type: 'music' },
    execute(message: Message, input: string) {
        if (!input)
            return message.reply(i18n.__("move.errorInput")).catch(console.error);

        const arrMsg = input.split(' ')
        const movefromArg = Number.parseInt(arrMsg[0])
        const movetoArg = Number.parseInt(arrMsg[1])

        const guildMemer = message.guild!.members.cache.get(message.author.id);
        const queue = bot.queues.get(message.guild!.id);

        if (!queue) return message.reply(i18n.__("move.errorNotQueue")).catch(console.error);

        if (!canModifyQueue(guildMemer!)) return;

        if (!movefromArg || !movetoArg)
            return message.reply({ content: i18n.__mf("move.usagesReply", { prefix: bot.prefix }) });

        if (isNaN(movefromArg) || movefromArg <= 1)
            return message.reply({ content: i18n.__mf("move.usagesReply", { prefix: bot.prefix }) });

        let song = queue.songs[movefromArg - 1];

        queue.songs = move(queue.songs, movefromArg - 1, movetoArg == 1 ? 1 : movetoArg - 1);

        message.reply({
            content: i18n.__mf("move.result", {
                author: message.author.id,
                title: song.title,
                index: movetoArg == 1 ? 1 : movetoArg
            })
        });
    }
}