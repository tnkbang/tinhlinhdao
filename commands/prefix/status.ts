import { bot } from './../../index';
import { i18n } from "../../utils/i18n";
import { getTypeStatus } from '../Helper';
import { config } from "../../utils/config";
import { Message } from "discord.js";
import { CommandType } from '../../interfaces/Command';

export default {
    data: {
        name: 'status',
        sname: 'stt',
        type: CommandType.Administrator,
        description: i18n.__("status.description"),
        fields: [
            {
                name: i18n.__("common.fieldsUse"),
                value: `• **${bot.prefix}status <type> <msg>**` + '\n' +
                    `• **${bot.prefix}stt <type> <msg>**` + '\n' +
                    `• **<type>** ` + i18n.__("status.fieldsType") + '\n' +
                    `• **<type>** ` + i18n.__("status.fieldsMsg")
            }
        ]
    },
    execute(message: Message, input: string) {
        const ownerID = config.OWNER
        const arrMsg = input.toLowerCase().split(' ')
        const type = arrMsg[0]
        const value = input.replace(arrMsg[0], '').trim()

        if (message.member?.user.id == ownerID) {

            const thisType = getTypeStatus(type)
            const thisVal = value ? value : '/help'

            bot.client.user?.setActivity({
                name: thisVal,
                type: thisType.valueOf()
            })

            return message
                .reply({ content: i18n.__("status.result") })
                .catch(console.error);
        }

        return message
            .reply({ content: i18n.__("status.missingPermission") })
            .catch(console.error);
    }
}