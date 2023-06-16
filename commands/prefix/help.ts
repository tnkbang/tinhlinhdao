import { CommandType } from '../../interfaces/Command';
import { i18n } from "../../utils/i18n";
import { setHelp } from '../Helper';
import { Message } from "discord.js";

export default {
    data: {
        name: 'help',
        sname: 'h',
        type: CommandType.Infomation,
        description: i18n.__("help.description")
    },
    async execute(message: Message, input: string) {
        return message.reply({ embeds: [setHelp(input)] }).catch(console.error);
    }
}