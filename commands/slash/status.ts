import { bot } from './../../index';
import { i18n } from "../../utils/i18n";
import { getTypeStatus } from '../Helper';
import { config } from "../../utils/config";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

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

            const thisType = getTypeStatus(type)
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
}