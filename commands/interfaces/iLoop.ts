import { bot } from './../../index';
import { GuildMember } from 'discord.js';
import { i18n } from "./../../utils/i18n";
import { canModifyQueue } from '../../utils/queue';

function setLoopContent(guildID: string, guildMember: GuildMember | undefined) {
    const queue = bot.queues.get(guildID);

    if (!queue) return i18n.__("loop.errorNotQueue")
    if (!guildMember || !canModifyQueue(guildMember)) return i18n.__("common.errorNotChannel");

    queue.loop = !queue.loop;

    const content = {
        content: i18n.__mf("loop.result", { loop: queue.loop ? i18n.__("common.on") : i18n.__("common.off") })
    };

    return content
}

export default setLoopContent