import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} from "discord.js";
import { bot } from './../../index';
import { i18n } from "./../../utils/i18n";

const inviteEmbed = new EmbedBuilder().setTitle(i18n.__mf("Invite me to your server!"));

// return interaction with embed and button to invite the bot
const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
        .setLabel(i18n.__mf("Invite"))
        .setStyle(ButtonStyle.Link)
        .setURL(
            `https://discord.com/api/oauth2/authorize?client_id=${bot.client.user!.id
            }&permissions=8&scope=bot%20applications.commands`
        )
);

export { inviteEmbed, actionRow }