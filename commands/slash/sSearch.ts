import {
    ChatInputCommandInteraction,
    SlashCommandBuilder
} from "discord.js";
import { i18n } from "./../../utils/i18n";
import setSearch from "../interfaces/iSearch";

export default {
    data: new SlashCommandBuilder()
        .setName("search")
        .setDescription(i18n.__("search.description"))
        .addStringOption((option) =>
            option.setName("query").setDescription(i18n.__("search.optionQuery")).setRequired(true)
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        await setSearch(interaction)
    }
}