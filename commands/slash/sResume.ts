import { i18n } from "./../../utils/i18n";
import setResume from "../interfaces/iResume";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder().setName("resume").setDescription(i18n.__("resume.description")),
    execute(interaction: ChatInputCommandInteraction) {
        setResume(interaction)
    }
}