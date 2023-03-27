import {
    ChatInputCommandInteraction,
    SlashCommandBuilder
} from "discord.js";
import { i18n } from "../../utils/i18n";
import { setInvite } from "../helper/miscHelper";

export default {
    data: new SlashCommandBuilder().setName("invite").setDescription(i18n.__("invite.description")),
    execute(interaction: ChatInputCommandInteraction) {
        setInvite(interaction)
    }
}