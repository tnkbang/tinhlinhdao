import { i18n } from "./../../utils/i18n";
import setSleep from "../interfaces/iSleep";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder().setName("sleep").setDescription(i18n.__("sleep.description")),
    execute(interaction: ChatInputCommandInteraction) {
        setSleep(interaction)
    }
}