import { setSleep } from "../Helper"
import { Message } from "discord.js"

export default {
    execute(message: Message) {
        setSleep(message)
    }
}