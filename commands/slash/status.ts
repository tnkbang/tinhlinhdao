import { i18n } from "../../utils/i18n";
import { setStatus } from "../helper/miscHelper";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder().setName("status").setDescription(i18n.__("status.description"))
        .addStringOption((option) => option.setName("type")
            .setDescription(i18n.__("status.type")).setRequired(true))
        .addStringOption((option) => option.setName("value")
            .setDescription(i18n.__("status.value")).setRequired(true)),
    execute(interaction: ChatInputCommandInteraction) {
        setStatus(interaction)
    }
}