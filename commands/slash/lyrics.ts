import { i18n } from "../../utils/i18n";
import { setLyrics } from "../helper/musicHelper";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder().setName("lyrics").setDescription(i18n.__("lyrics.description")),
    async execute(interaction: ChatInputCommandInteraction) {
        await setLyrics(interaction)
    }
}