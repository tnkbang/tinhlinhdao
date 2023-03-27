import { i18n } from "./../../utils/i18n";
import setLoopContent from "../interfaces/iLoop";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder().setName("loop").setDescription(i18n.__("loop.description")),
    execute(interaction: ChatInputCommandInteraction) {
        const guildID = interaction.guild!.id
        const guildMember = interaction.guild!.members.cache.get(interaction.user.id)
        const content = setLoopContent(guildID, guildMember)

        if (interaction.replied) interaction.followUp(content).catch(console.error);
        else interaction.reply(content).catch(console.error);
    }
};