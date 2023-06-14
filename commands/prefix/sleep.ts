import { setSleep } from "../Helper"
import { Message } from "discord.js"

export default {
    data: { name: 'sleep', sname: 'sp', type: 'misc' },
    execute(message: Message) {
        setSleep(message)
    }
}