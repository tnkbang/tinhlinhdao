import { i18n } from "../../utils/i18n";
import setHelpEmbed from "../interfaces/iHelp";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder().setName("help").setDescription(i18n.__("help.description")),
    async execute(interaction: CommandInteraction) {
        return interaction.reply({ embeds: [setHelpEmbed()] }).catch(console.error);
    }
};