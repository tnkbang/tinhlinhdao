import {
    ChatInputCommandInteraction,
    SlashCommandBuilder
} from "discord.js";
import { i18n } from "./../../utils/i18n";
import { actionRow, inviteEmbed } from "../interfaces/iInvite";

export default {
    data: new SlashCommandBuilder().setName("invite").setDescription(i18n.__("invite.description")),
    execute(interaction: ChatInputCommandInteraction) {
        return interaction.reply({ embeds: [inviteEmbed], components: [actionRow] }).catch(console.error);
    }
};