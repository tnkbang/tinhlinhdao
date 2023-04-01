import { i18n } from "../../utils/i18n";
import { Message } from "discord.js";

export default {
    execute(message: Message) {
        message
            .reply({ content: i18n.__mf("ping.result", { ping: Math.round(message.client.ws.ping) }) })
            .catch(console.error);
    }
}