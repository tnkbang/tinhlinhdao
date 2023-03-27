import { i18n } from "./../../utils/i18n";
import setUptime from "../interfaces/iUptime";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder().setName("uptime").setDescription(i18n.__("uptime.description")),
    execute(interaction: ChatInputCommandInteraction) {
        setUptime(interaction)
    }
}