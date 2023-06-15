import { setHelp } from '../Helper';
import { Message } from "discord.js";

export default {
    data: { name: 'help', sname: 'h', type: 'info' },
    async execute(message: Message, input: string) {
        return message.reply({ embeds: [setHelp(input)] }).catch(console.error);
    }
}