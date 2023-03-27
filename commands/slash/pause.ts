import { i18n } from "../../utils/i18n";
import { setPause } from "../helper/musicHelper";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder().setName("pause").setDescription(i18n.__("pause.description")),
    execute(interaction: ChatInputCommandInteraction) {
        setPause(interaction)
    }
}