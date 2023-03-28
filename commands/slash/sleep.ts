import { setSleep } from "../Helper"
import { i18n } from "../../utils/i18n"
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js"

export default {
    data: new SlashCommandBuilder().setName("sleep").setDescription(i18n.__("sleep.description")),
    execute(interaction: ChatInputCommandInteraction) {
        setSleep(interaction)
    }
}