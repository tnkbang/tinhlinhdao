import { CommandType } from "../../interfaces/Command";
import { i18n } from "../../utils/i18n";
import { setInvite } from "../Helper";
import { Message } from "discord.js";
import { bot } from './../../index';

export default {
    data: {
        name: 'invite',
        sname: 'i',
        type: CommandType.Infomation,
        description: i18n.__("invite.description"),
        fields: [
            {
                name: i18n.__("common.fieldsUse"),
                value: `• **${bot.prefix}invite**` + '\n' +
                    `• **${bot.prefix}i**`
            }
        ]
    },
    execute(message: Message) {
        let invite = setInvite()
        return message.reply({ embeds: [invite.inviteEmbed], components: [invite.actionRow] }).catch(console.error);
    }
}