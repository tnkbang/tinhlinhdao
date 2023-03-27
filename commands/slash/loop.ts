import { i18n } from "../../utils/i18n";
import { setLoop } from "../helper/musicHelper";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder().setName("loop").setDescription(i18n.__("loop.description")),
    execute(interaction: ChatInputCommandInteraction) {
        setLoop(interaction)
    }
}