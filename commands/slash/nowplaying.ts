import { i18n } from "../../utils/i18n";
import { setNowPlaying } from "../helper/musicHelper";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder().setName("nowplaying").setDescription(i18n.__("nowplaying.description")),
    cooldown: 10,
    execute(interaction: ChatInputCommandInteraction) {
        setNowPlaying(interaction)
    }
}