import { bot } from "./../../index";
// @ts-ignore
import lyricsFinder from "lyrics-finder";
import { i18n } from "./../../utils/i18n";
import { randomColor } from "./../../utils/color";
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

async function setLyricsEmbed(interaction: ChatInputCommandInteraction) {
    const queue = bot.queues.get(interaction.guild!.id);

    if (!queue || !queue.songs.length) return i18n.__("lyrics.errorNotQueue")

    await interaction.reply("⏳ Loading...").catch(console.error);

    let lyrics = null;
    const title = queue.songs[0].title;

    try {
        lyrics = await lyricsFinder(queue.songs[0].title, "");
        if (!lyrics) lyrics = i18n.__mf("lyrics.lyricsNotFound", { title: title });
    } catch (error) {
        lyrics = i18n.__mf("lyrics.lyricsNotFound", { title: title });
    }

    let lyricsEmbed = new EmbedBuilder()
        .setTitle(i18n.__mf("lyrics.embedTitle", { title: title }))
        .setDescription(lyrics.length >= 4096 ? `${lyrics.substr(0, 4093)}...` : lyrics)
        .setColor(randomColor())
        .setTimestamp();

    return interaction.editReply({ content: "", embeds: [lyricsEmbed] }).catch(console.error);
}

export default setLyricsEmbed