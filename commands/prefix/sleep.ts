import { CommandType } from "../../interfaces/Command"
import { i18n } from "../../utils/i18n";
import { setSleep } from "../Helper"
import { Message } from "discord.js"
import { bot } from './../../index';

export default {
    data: {
        name: 'sleep',
        sname: 'sp',
        type: CommandType.MISC,
        description: i18n.__("sleep.description"),
        fields: [
            {
                name: i18n.__("common.fieldsUse"),
                value: `• **${bot.prefix}sleep**` + '\n' +
                    `• **${bot.prefix}sp**`
            }
        ]
    },
    execute(message: Message) {
        setSleep(message)
    }
}