import { bot } from './../index';
import { ActivityType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { i18n } from "../utils/i18n";
import { config } from "../utils/config";

function getType(type: string | null) {
    type = type ? type.toLowerCase() : 'l'
    switch (type) {
        case 'p': return ActivityType.Playing
        case 'play': return ActivityType.Playing

        case 'w': return ActivityType.Watching
        case 'watch': return ActivityType.Watching

        case 'l': return ActivityType.Listening
        case 'listen': return ActivityType.Listening

        case 's': return ActivityType.Streaming
        case 'stream': return ActivityType.Streaming

        case 'c': return ActivityType.Custom
        case 'custom': return ActivityType.Custom

        case 'compet': return ActivityType.Competing

        default: return ActivityType.Playing
    }
}

export default {
    data: new SlashCommandBuilder().setName("status").setDescription(i18n.__("status.description"))
        .addStringOption((option) => option.setName("type")
            .setDescription(i18n.__("status.type")).setRequired(true))
        .addStringOption((option) => option.setName("value")
            .setDescription(i18n.__("status.value")).setRequired(true)),
    execute(interaction: ChatInputCommandInteraction) {
        const ownerID = config.OWNER
        if (interaction.member?.user.id == ownerID) {
            const type = interaction.options.getString('type')
            const value = interaction.options.getString('value')

            const thisType = getType(type)
            const thisVal = value ? value : '/help'

            bot.client.user?.setActivity({
                name: thisVal,
                type: thisType.valueOf()
            })

            return interaction
                .reply({ content: i18n.__("status.result") })
                .catch(console.error);
        }

        return interaction
            .reply({ content: i18n.__("status.missingPermission") })
            .catch(console.error);
    }
};