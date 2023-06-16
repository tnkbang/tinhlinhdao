import { CommandType } from "../../interfaces/Command";
import { i18n } from "../../utils/i18n";
import { setInvite } from "../Helper";
import { Message } from "discord.js";

export default {
    data: {
        name: 'invite',
        sname: 'i',
        type: CommandType.Infomation,
        description: i18n.__("invite.description")
    },
    execute(message: Message) {
        let invite = setInvite()
        return message.reply({ embeds: [invite.inviteEmbed], components: [invite.actionRow] }).catch(console.error);
    }
}