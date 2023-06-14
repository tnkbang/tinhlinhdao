import { bot } from './../../index';
import { i18n } from "../../utils/i18n";
import { getTypeStatus } from '../Helper';
import { config } from "../../utils/config";
import { Message } from "discord.js";

export default {
    data: { name: 'status', type: 'admin' },
    execute(message: Message, input: string) {
        const ownerID = config.OWNER
        const arrMsg = input.split(' ')
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