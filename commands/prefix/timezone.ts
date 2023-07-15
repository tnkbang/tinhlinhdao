import { CommandType } from './../../interfaces/Command';
import { Message } from "discord.js";
import { bot } from './../../index';
import { i18n } from "../../utils/i18n";
import { TimeZone } from '../../structs/TimeZone';

export default {
    data: {
        name: 'timezone',
        sname: 'tz;zone',
        type: CommandType.Infomation,
        description: i18n.__("timezone.description"),
        fields: [
            {
                name: i18n.__("common.fieldsUse"),
                value: `• **${bot.prefix}timezone** : ` + i18n.__("timezone.fieldsInfo") + '\n' +
                    `• **${bot.prefix}timezone <utc zone>** : ` + i18n.__("timezone.fieldsSet") + '\n'
            }, {
                name: i18n.__("common.fieldsShort"),
                value: '• timezone = zone = tz\n'
            }, {
                name: i18n.__("common.fieldsExample"),
                value: i18n.__("timezone.fieldsExample") + '\n' +
                    `• **${bot.prefix}timezone 7**\n` +
                    `• **${bot.prefix}zone 7**\n` +
                    `• **${bot.prefix}tz 7**\n`
            }
        ]
    },
    async execute(message: Message, input: string) {
        const zones = new TimeZone();
        zones.get();
        let userZone = zones.getUserZone(message.author.id, zones)

        if (!input) return message.reply(i18n.__mf("timezone.replyZone",
            { zone: (userZone > 0 ? '+' : '') + userZone }))

        userZone = Number.parseInt(input)
        zones.set(message.author.id, userZone)
        zones.save()

        return message.reply(i18n.__mf("timezone.replySave",
            { zone: (userZone > 0 ? '+' : '') + userZone }))
    }
}