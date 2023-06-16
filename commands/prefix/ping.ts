import { CommandType } from "../../interfaces/Command";
import { i18n } from "../../utils/i18n";
import { Message } from "discord.js";

export default {
    data: {
        name: 'ping',
        type: CommandType.Infomation,
        description: i18n.__("ping.description")
    },
    execute(message: Message) {
        message
            .reply({ content: i18n.__mf("ping.result", { ping: Math.round(message.client.ws.ping) }) })
            .catch(console.error);
    }
}