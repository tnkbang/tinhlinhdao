import { bot } from './../../index';
import { i18n } from "../../utils/i18n";
import { getTypeStatus } from '../Helper';
import { config } from "../../utils/config";
import { Message } from "discord.js";

export default {
    execute(message: Message, type: string, value: string) {
        const ownerID = config.OWNER
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