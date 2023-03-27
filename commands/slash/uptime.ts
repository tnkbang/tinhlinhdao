import { i18n } from "../../utils/i18n";
import { setUptime } from "../helper/miscHelper";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder().setName("uptime").setDescription(i18n.__("uptime.description")),
    execute(interaction: ChatInputCommandInteraction) {
        setUptime(interaction)
    }
}