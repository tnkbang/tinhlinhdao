import {
    ChatInputCommandInteraction,
    PermissionsBitField,
    SlashCommandBuilder
} from "discord.js";
import { i18n } from "./../../utils/i18n";
import setPlayList from "../interfaces/iPlayList";

export default {
    data: new SlashCommandBuilder()
        .setName("playlist")
        .setDescription(i18n.__("playlist.description"))
        .addStringOption((option) => option.setName("playlist").setDescription("Playlist name or link").setRequired(true)),
    cooldown: 5,
    permissions: [
        PermissionsBitField.Flags.Connect,
        PermissionsBitField.Flags.Speak,
        PermissionsBitField.Flags.AddReactions,
        PermissionsBitField.Flags.ManageMessages
    ],
    async execute(interaction: ChatInputCommandInteraction) {
        setPlayList(interaction)
    }
}