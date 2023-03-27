import { i18n } from "../../utils/i18n";
import { setPing } from "../helper/miscHelper";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder().setName("ping").setDescription(i18n.__("ping.description")),
    cooldown: 10,
    execute(interaction: ChatInputCommandInteraction) {
        setPing(interaction)
    }
}