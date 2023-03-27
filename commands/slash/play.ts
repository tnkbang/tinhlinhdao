import { i18n } from "../../utils/i18n";
import { setPlay } from "../helper/musicHelper";
import { ChatInputCommandInteraction, PermissionsBitField, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription(i18n.__("play.description"))
        .addStringOption((option) => option.setName("song").setDescription(i18n.__("play.songDescription")).setRequired(true)),
    cooldown: 3,
    permissions: [
        PermissionsBitField.Flags.Connect,
        PermissionsBitField.Flags.Speak,
        PermissionsBitField.Flags.AddReactions,
        PermissionsBitField.Flags.ManageMessages
    ],
    async execute(interaction: ChatInputCommandInteraction, input: string) {
        setPlay(interaction, input)
    }
}