import { i18n } from "../../utils/i18n";
import { setMove } from "../helper/musicHelper";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("move")
        .setDescription(i18n.__("move.description"))
        .addIntegerOption((option) =>
            option.setName("movefrom").setDescription(i18n.__("move.args.movefrom")).setRequired(true)
        )
        .addIntegerOption((option) =>
            option.setName("moveto").setDescription(i18n.__("move.args.moveto")).setRequired(true)
        ),
    execute(interaction: ChatInputCommandInteraction) {
        setMove(interaction)
    }
};
