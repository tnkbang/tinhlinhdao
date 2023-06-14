import { bot } from './../../index';
import { i18n } from "../../utils/i18n";
// @ts-ignore
import lyricsFinder from "lyrics-finder";
import { randomColor } from '../../utils/color';
import { EmbedBuilder, Message } from "discord.js";

export default {
    data: { name: 'lyrics', sname: 'ly', type: 'music' },
    async execute(message: Message) {
        const queue = bot.queues.get(message.guild!.id);

        if (!queue || !queue.songs.length) return i18n.__("lyrics.errorNotQueue")

        await message.reply("⏳ Loading...").catch(console.error);

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

        await message.delete().catch(console.error)
        return message.reply({ content: "", embeds: [lyricsEmbed] }).catch(console.error);
    }
}