import { i18n } from "./../../utils/i18n";
import setPing from "../interfaces/iPing";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder().setName("ping").setDescription(i18n.__("ping.description")),
    cooldown: 10,
    execute(interaction: ChatInputCommandInteraction) {
        setPing(interaction)
    }
}