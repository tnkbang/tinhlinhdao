import { setInvite } from "../Helper";
import { Message } from "discord.js";

export default {
    data: { name: 'invite', sname: 'i', type: 'info' },
    execute(message: Message) {
        let invite = setInvite()
        return message.reply({ embeds: [invite.inviteEmbed], components: [invite.actionRow] }).catch(console.error);
    }
}