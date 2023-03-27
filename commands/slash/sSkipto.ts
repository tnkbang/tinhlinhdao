import { i18n } from "./../../utils/i18n";
import setSkipto from "../interfaces/iSkipto";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("skipto")
        .setDescription(i18n.__("skipto.description"))
        .addIntegerOption((option) =>
            option.setName("number").setDescription(i18n.__("skipto.args.number")).setRequired(true)
        ),
    execute(interaction: ChatInputCommandInteraction) {
        setSkipto(interaction)
    }
}