import { setHelp } from '../Helper';
import { i18n } from "../../utils/i18n";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription(i18n.__("help.description"))
        .addStringOption((option) => option.setName("type").setDescription(i18n.__("help.description"))),
    async execute(interaction: ChatInputCommandInteraction) {
        const input = interaction.options.getString("type");
        return interaction.reply({ embeds: [setHelp(input || "")] }).catch(console.error);
    }
}