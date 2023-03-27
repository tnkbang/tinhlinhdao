import { i18n } from "../../utils/i18n";
import { setShuffle } from "../helper/musicHelper";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder().setName("shuffle").setDescription(i18n.__("shuffle.description")),
    execute(interaction: ChatInputCommandInteraction) {
        setShuffle(interaction)
    }
}