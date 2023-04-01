import { bot } from './../../index';
import { i18n } from "../../utils/i18n";
import { Song } from '../../structs/Song';
import { canModifyQueue } from "../../utils/queue";
import { Message } from "discord.js";

const pattern = /^[0-9]{1,2}(\s*,\s*[0-9]{1,2})*$/;

export default {
    execute(message: Message, input: string) {
        if (!input) return message.reply({ content: i18n.__("remove.errorInput") }).catch(console.error)
        const guildMemer = message.guild!.members.cache.get(message.author.id);
        const removeArgs = input

        const queue = bot.queues.get(message.guild!.id);

        if (!queue)
            return message.reply({ content: i18n.__("remove.errorNotQueue") }).catch(console.error);

        if (!canModifyQueue(guildMemer!)) return i18n.__("common.errorNotChannel");

        if (!removeArgs)
            return message.reply({ content: i18n.__mf("remove.usageReply", { prefix: bot.prefix }) });

        const songs = removeArgs.split(",").map((arg: any) => parseInt(arg));

        let removed: Song[] = [];

        if (pattern.test(removeArgs)) {
            queue.songs = queue.songs.filter((item, index) => {
                if (songs.find((songIndex: any) => songIndex - 1 === index)) removed.push(item);
                else return true;
            });

            message.reply(
                i18n.__mf("remove.result", {
                    title: removed.map((song) => song.title).join("\n"),
                    author: message.author.id
                })
            );
        } else if (!isNaN(+removeArgs) && +removeArgs >= 1 && +removeArgs <= queue.songs.length) {
            return message.reply(
                i18n.__mf("remove.result", {
                    title: queue.songs.splice(+removeArgs - 1, 1)[0].title,
                    author: message.author.id
                })
            );
        } else {
            return message.reply({ content: i18n.__mf("remove.usageReply", { prefix: bot.prefix }) });
        }
    }
}