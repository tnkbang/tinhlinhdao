import { CommandType } from "../../interfaces/Command"
import { i18n } from "../../utils/i18n";
import { setSleep } from "../Helper"
import { Message } from "discord.js"

export default {
    data: {
        name: 'sleep',
        sname: 'sp',
        type: CommandType.MISC,
        description: i18n.__("sleep.description")
    },
    execute(message: Message) {
        setSleep(message)
    }
}