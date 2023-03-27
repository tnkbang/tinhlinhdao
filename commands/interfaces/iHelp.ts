import { bot } from '../../index';
import { i18n } from "../../utils/i18n";
import { EmbedBuilder } from "discord.js";
import { randomColor } from "../../utils/color";

let helpEmbed: EmbedBuilder;

function setHelpEmbed() {
    const commands = bot.slashCommandsMap;

    helpEmbed = new EmbedBuilder()
        .setTitle(i18n.__mf("help.embedTitle", { botname: bot.client.user!.username }))
        .setDescription(i18n.__("help.embedDescription"))
        .setColor(randomColor());

    commands.forEach((cmd) => {
        helpEmbed.addFields({
            name: `**${cmd.data.name}**`,
            value: `${cmd.data.description}`,
            inline: true
        });
    });

    helpEmbed.setTimestamp();

    return helpEmbed
}

export default setHelpEmbed