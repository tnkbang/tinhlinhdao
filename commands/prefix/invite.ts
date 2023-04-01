import { setInvite } from "../Helper";
import { Message } from "discord.js";

export default {
    execute(message: Message) {
        let invite = setInvite()
        return message.reply({ embeds: [invite.inviteEmbed], components: [invite.actionRow] }).catch(console.error);
    }
}