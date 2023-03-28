import { setInvite } from "../Helper";
import { i18n } from "../../utils/i18n";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder().setName("invite").setDescription(i18n.__("invite.description")),
    execute(interaction: ChatInputCommandInteraction) {
        let invite = setInvite()
        return interaction.reply({ embeds: [invite.inviteEmbed], components: [invite.actionRow] }).catch(console.error);
    }
}