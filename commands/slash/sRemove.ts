import { i18n } from "./../../utils/i18n";
import setRemove from "../interfaces/iRemove";
import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("remove")
        .setDescription(i18n.__("remove.description"))
        .addStringOption((option) =>
            option.setName("slot").setDescription(i18n.__("remove.description")).setRequired(true)
        ),
    execute(interaction: ChatInputCommandInteraction) {
        setRemove(interaction)
    }
}