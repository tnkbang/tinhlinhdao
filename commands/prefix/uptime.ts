import { CommandType } from "../../interfaces/Command";
import { i18n } from "../../utils/i18n";
import { setUptime } from "../Helper";
import { Message } from "discord.js";
import { bot } from './../../index';

export default {
    data: {
        name: 'uptime',
        sname: 'ut',
        type: CommandType.Infomation,
        description: i18n.__("uptime.description"),
        fields: [
            {
                name: i18n.__("common.fieldsUse"),
                value: `• **${bot.prefix}uptime**` + '\n' +
                    `• **${bot.prefix}ut**`
            }
        ]
    },
    execute(message: Message) {
        setUptime(message)
    }
}