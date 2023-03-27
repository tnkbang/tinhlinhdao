import { i18n } from "../../utils/i18n";
import { setHelp } from "../helper/miscHelper";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder().setName("help").setDescription(i18n.__("help.description")),
    async execute(interaction: CommandInteraction) {
        setHelp(interaction)
    }
}