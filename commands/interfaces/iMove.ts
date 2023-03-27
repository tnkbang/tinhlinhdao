import move from "array-move";
import { bot } from "./../../index";
import { i18n } from "./../../utils/i18n";
import { canModifyQueue } from "./../../utils/queue";
import { ChatInputCommandInteraction } from "discord.js";

function setMove(interaction: ChatInputCommandInteraction) {
    const movefromArg = interaction.options.getInteger("movefrom");
    const movetoArg = interaction.options.getInteger("moveto");

    const guildMemer = interaction.guild!.members.cache.get(interaction.user.id);
    const queue = bot.queues.get(interaction.guild!.id);

    if (!queue) return interaction.reply(i18n.__("move.errorNotQueue")).catch(console.error);

    if (!canModifyQueue(guildMemer!)) return;

    if (!movefromArg || !movetoArg)
        return interaction.reply({ content: i18n.__mf("move.usagesReply", { prefix: bot.prefix }), ephemeral: true });

    if (isNaN(movefromArg) || movefromArg <= 1)
        return interaction.reply({ content: i18n.__mf("move.usagesReply", { prefix: bot.prefix }), ephemeral: true });

    let song = queue.songs[movefromArg - 1];

    queue.songs = move(queue.songs, movefromArg - 1, movetoArg == 1 ? 1 : movetoArg - 1);

    interaction.reply({
        content: i18n.__mf("move.result", {
            author: interaction.user.id,
            title: song.title,
            index: movetoArg == 1 ? 1 : movetoArg
        })
    });
}

export default setMove