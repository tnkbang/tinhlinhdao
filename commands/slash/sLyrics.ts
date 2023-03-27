import { i18n } from "./../../utils/i18n";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import setLyricsEmbed from "../interfaces/iLyrics";

export default {
    data: new SlashCommandBuilder().setName("lyrics").setDescription(i18n.__("lyrics.description")),
    async execute(interaction: ChatInputCommandInteraction) {
        await setLyricsEmbed(interaction)
    }
};
