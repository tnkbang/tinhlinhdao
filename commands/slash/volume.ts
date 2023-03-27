import { i18n } from "../../utils/i18n";
import { setVolume } from "../helper/musicHelper";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("volume")
        .setDescription(i18n.__("volume.description"))
        .addIntegerOption((option) => option.setName("volume").setDescription(i18n.__("volume.description"))),
    execute(interaction: ChatInputCommandInteraction) {
        setVolume(interaction)
    }
}