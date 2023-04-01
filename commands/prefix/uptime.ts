import { setUptime } from "../Helper";
import { Message } from "discord.js";

export default {
    execute(message: Message) {
        setUptime(message)
    }
}