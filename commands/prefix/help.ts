import { setHelp } from '../Helper';
import { Message } from "discord.js";

export default {
    async execute(message: Message) {
        return message.reply({ embeds: [setHelp()] }).catch(console.error);
    }
}