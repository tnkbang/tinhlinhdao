import { bot } from './../../index';
import { i18n } from "../../utils/i18n";
import { splitBar } from "string-progressbar";
import { randomColor } from "../../utils/color";
import { EmbedBuilder, Message } from "discord.js";
import { CommandType } from '../../interfaces/Command';

export default {
    data: {
        name: 'nowplaying',
        sname: 'np',
        type: CommandType.Music,
        description: i18n.__("nowplaying.description"),
        fields: [
            {
                name: i18n.__("common.fieldsUse"),
                value: `• **${bot.prefix}nowplaying**` + '\n' +
                    `• **${bot.prefix}np**`
            }
        ]
    },
    execute(message: Message) {
        const queue = bot.queues.get(message.guild!.id);

        if (!queue || !queue.songs.length)
            return message.reply({ content: i18n.__("nowplaying.errorNotQueue") }).catch(console.error);

        const song = queue.songs[0];
        const seek = queue.resource.playbackDuration / 1000;
        const left = song.duration - seek;

        let nowPlaying = new EmbedBuilder()
            .setTitle(i18n.__("nowplaying.embedTitle"))
            .setDescription(`${song.title}\n${song.url}`)
            .setColor(randomColor());

        if (song.duration > 0) {
            nowPlaying.addFields({
                name: "\u200b",
                value:
                    new Date(seek * 1000).toISOString().substr(11, 8) +
                    "[" +
                    splitBar(song.duration == 0 ? seek : song.duration, seek, 20)[0] +
                    "]" +
                    (song.duration == 0 ? " ◉ LIVE" : new Date(song.duration * 1000).toISOString().substr(11, 8)),
                inline: false
            });

            nowPlaying.setFooter({
                text: i18n.__mf("nowplaying.timeRemaining", {
                    time: new Date(left * 1000).toISOString().substr(11, 8)
                })
            });
        }

        return message.reply({ embeds: [nowPlaying] });
    }
}