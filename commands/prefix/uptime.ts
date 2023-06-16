import { CommandType } from "../../interfaces/Command";
import { i18n } from "../../utils/i18n";
import { setUptime } from "../Helper";
import { Message } from "discord.js";

export default {
    data: {
        name: 'uptime',
        sname: 'ut',
        type: CommandType.Infomation,
        description: i18n.__("uptime.description")
    },
    execute(message: Message) {
        setUptime(message)
    }
}