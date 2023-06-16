import { bot } from './../../index';
import { i18n } from "../../utils/i18n";
import { canModifyQueue } from "../../utils/queue";
import { Message } from "discord.js";
import { CommandType } from '../../interfaces/Command';

export default {
    data: {
        name: 'volume',
        sname: 'v',
        type: CommandType.Music,
        description: i18n.__("volume.description")
    },
    execute(message: Message, volume: string) {
        if (!volume)
            return message.reply({ content: i18n.__("volume.errorInput") }).catch(console.error);

        const volumeArg = Number.parseInt(volume)
        const queue = bot.queues.get(message.guild!.id);
        const guildMemer = message.guild!.members.cache.get(message.author.id);

        if (!queue)
            return message.reply({ content: i18n.__("volume.errorNotQueue") }).catch(console.error);

        if (!canModifyQueue(guildMemer!))
            return message.reply({ content: i18n.__("volume.errorNotChannel") }).catch(console.error);

        if (!volumeArg || volumeArg === queue.volume)
            return message
                .reply({ content: i18n.__mf("volume.currentVolume", { volume: queue.volume }) })
                .catch(console.error);

        if (isNaN(volumeArg))
            return message.reply({ content: i18n.__("volume.errorNotNumber") }).catch(console.error);

        if (Number(volumeArg) > 100 || Number(volumeArg) < 0)
            return message.reply({ content: i18n.__("volume.errorNotValid") }).catch(console.error);

        queue.volume = volumeArg;
        queue.resource.volume?.setVolumeLogarithmic(volumeArg / 100);

        return message.reply({ content: i18n.__mf("volume.result", { arg: volumeArg }) }).catch(console.error);
    }
}