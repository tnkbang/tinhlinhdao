import { i18n } from "../../utils/i18n"
import { setSkip } from "../helper/musicHelper"
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js"

export default {
    data: new SlashCommandBuilder().setName("skip").setDescription(i18n.__("skip.description")),
    execute(interaction: ChatInputCommandInteraction) {
        setSkip(interaction)
    }
}