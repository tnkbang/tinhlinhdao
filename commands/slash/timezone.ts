import { i18n } from "../../utils/i18n";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { TimeZone } from '../../structs/TimeZone';

export default {
    data: new SlashCommandBuilder()
        .setName("timezone")
        .setDescription(i18n.__("timezone.description"))
        .addIntegerOption((option) => option.setName("utc").setDescription(i18n.__("timezone.input"))),
    execute(interaction: ChatInputCommandInteraction) {
        const input = interaction.options.getInteger("utc");
        const zones = new TimeZone();
        zones.get();
        let userZone = zones.iGetUserZone(interaction, zones)

        if (!input) return interaction.reply(i18n.__mf("timezone.replyZone",
            { zone: (userZone > 0 ? '+' : '') + userZone }))

        userZone = input
        zones.iSet(interaction, userZone)
        zones.save()

        return interaction.reply(i18n.__mf("timezone.replySave",
            { zone: (userZone > 0 ? '+' : '') + userZone }))
    }
}