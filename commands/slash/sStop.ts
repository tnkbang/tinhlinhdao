import { i18n } from "./../../utils/i18n";
import setStop from "../interfaces/iStop";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder().setName("stop").setDescription(i18n.__("stop.description")),
    execute(interaction: ChatInputCommandInteraction) {
        setStop(interaction)
    }
}