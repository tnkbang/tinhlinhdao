import {
    ChatInputCommandInteraction,
    PermissionsBitField,
    SlashCommandBuilder
} from "discord.js";
import { i18n } from "../../utils/i18n";
import { setQueue } from "../helper/musicHelper";

export default {
    data: new SlashCommandBuilder().setName("queue").setDescription(i18n.__("queue.description")),
    cooldown: 5,
    permissions: [PermissionsBitField.Flags.AddReactions, PermissionsBitField.Flags.ManageMessages],
    async execute(interaction: ChatInputCommandInteraction) {
        setQueue(interaction)
    }
}