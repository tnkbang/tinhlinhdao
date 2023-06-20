import { CommandType } from "../../interfaces/Command";
import { i18n } from "../../utils/i18n";
import { Message } from "discord.js";
import { bot } from './../../index';

export default {
    data: {
        name: 'ping',
        type: CommandType.Infomation,
        description: i18n.__("ping.description"),
        fields: [
            {
                name: i18n.__("common.fieldsUse"),
                value: `**${bot.prefix}ping**`
            }
        ]
    },
    execute(message: Message) {
        message
            .reply({ content: i18n.__mf("ping.result", { ping: Math.round(message.client.ws.ping) }) })
            .catch(console.error);
    }
}