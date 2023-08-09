import { CommandType } from '../../interfaces/Command';
import { i18n } from "../../utils/i18n";
import { setHelp } from '../Helper';
import { Message } from "discord.js";
import { bot } from './../../index';

export default {
    data: {
        name: 'help',
        sname: 'h',
        type: CommandType.Infomation,
        description: i18n.__("help.description"),
        fields: [
            {
                name: i18n.__("common.fieldsUse"),
                value: `• **${bot.prefix}help** : ` + i18n.__("help.fieldsList") + '\n' +
                    `• **${bot.prefix}help admin** : ` + i18n.__("help.fieldsAdmin") + '\n' +
                    `• **${bot.prefix}help info** : ` + i18n.__("help.fieldsInfo") + '\n' +
                    `• **${bot.prefix}help music** : ` + i18n.__("help.fieldsMusic") + '\n' +
                    `• **${bot.prefix}help misc** : ` + i18n.__("help.fieldsMISC") + '\n'
            }, {
                name: i18n.__("common.fieldsShort"),
                value: 'help = h'
            }, {
                name: i18n.__("common.fieldsExample"),
                value: i18n.__("help.fieldsExample") + '\n' +
                    `• **${bot.prefix}help favorite**\n` +
                    `• **${bot.prefix}help fav**\n` +
                    `• **${bot.prefix}h fav**\n`
            }
        ]
    },
    async execute(message: Message, input: string) {
        return message.reply({ embeds: [setHelp(input.toLowerCase())] }).catch(console.error);
    }
}