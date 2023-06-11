import { setUptime } from "../Helper";
import { Message } from "discord.js";

export default {
    data: { name: 'uptime', sname: 'ut' },
    execute(message: Message) {
        setUptime(message)
    }
}