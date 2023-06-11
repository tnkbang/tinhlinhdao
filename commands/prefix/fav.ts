import {
    EmbedBuilder,
    Message, TextChannel, VoiceBasedChannel
} from "discord.js";
import { Favorite } from "../../structs/Favorite";
import { bot } from './../../index';
import { i18n } from "../../utils/i18n";
import { MusicQueue } from "../../structs/MusicQueue";
import { MusicQueuePrefix } from "../../structs/MusicQueuePrefix";
import { randomColor } from "../../utils/color";
import { Song, SongData } from "../../structs/Song";
import { DiscordGatewayAdapterCreator, joinVoiceChannel } from "@discordjs/voice";

export default {
    data: { name: 'favorite', sname: 'fav;f' },
    async execute(message: Message, input: string) {
        const fav = new Favorite();
        fav.get();

        const guildMember = message.guild!.members.cache.get(message.author.id);
        const { channel } = guildMember!.voice;

        if (!channel)
            return message.reply({ content: i18n.__("play.errorNotChannel") }).catch(console.error);

        const queue = bot.queues.get(message.guild!.id);

        if (queue && channel.id !== queue.connection.joinConfig.channelId)
            return message
                .reply({
                    content: i18n.__mf("play.errorNotInSameChannel", { user: bot.client.user!.username })
                })
                .catch(console.error);

        if (!input) return readFavorite(message, fav)

        const arrMsg = input.split(' ')
        switch (arrMsg[0]) {
            case ('add'): {
                await addFavorite(arrMsg, message, fav, queue)
                break
            }
            case ('a'): {
                await addFavorite(arrMsg, message, fav, queue)
                break
            }
            case ('remove'): { }
            case ('r'): { }
            case ('play'): {
                playFavorite(fav, message, queue, channel)
                break
            }
            case ('p'): {
                playFavorite(fav, message, queue, channel)
                break
            }
            default: {
                helpFavorite(message)
                break
            }
        }
    }
}

function readFavorite(message: Message, fav: Favorite) {
    if (!fav.isUser(message, fav.value.user))
        return message
            .reply({ content: i18n.__("favorite.notFavorite") })
            .catch(console.error);

    let favEmbed = new EmbedBuilder()
        .setTitle(i18n.__("favorite.title"))
        .setColor(randomColor())
        .setTimestamp();

    fav.value.user.some(value => {
        if (value.user_id == message.author.id) {
            favEmbed.setDescription(value.musics.map((value: SongData, index: number) => `${index + 1}. ${value.title}`).join("\n"))
            return true
        }
    })

    return message.reply({ embeds: [favEmbed] }).catch(console.error);
}

function helpFavorite(message: Message) {
    return (message.channel as TextChannel)
        .send({ content: "Trợ giúp danh sách yêu thích !\nTạm thời chưa có thông tin." })
        .catch(console.error);
}

function playFavorite(fav: Favorite, message: Message, queue: MusicQueue | MusicQueuePrefix | undefined, channel: VoiceBasedChannel) {
    let lstFav: Song[] = []
    fav.value.user.some(value => {
        if (value.user_id == message.author.id) {
            value.musics.map((value: SongData) => lstFav.push(new Song(value)))
            return true
        }
    })

    if (queue) {
        queue.songs.push(...lstFav)
        return message
            .reply({ content: i18n.__("favorite.resultPlay") })
            .catch(console.error);
    } else {
        const newQueue = new MusicQueuePrefix({
            message,
            textChannel: message.channel! as TextChannel,
            connection: joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator
            })
        });

        bot.queues.set(message.guild!.id, newQueue);
        newQueue.enqueue(...lstFav)
    }
}

async function addFavorite(arrMsg: string[], message: Message, fav: Favorite, queue: MusicQueue | MusicQueuePrefix | undefined) {
    if (arrMsg[1]) {
        let song;
        try {
            song = await Song.from(arrMsg[1], arrMsg[1]);
            fav.set(message, song)
        } catch (error: any) {
            if (error.name == "NoResults")
                return message
                    .reply({ content: i18n.__mf("play.errorNoResults", { url: `<${arrMsg[1]}>` }) })
                    .catch(console.error);
            if (error.name == "InvalidURL")
                return message
                    .reply({ content: i18n.__mf("play.errorInvalidURL", { url: `<${arrMsg[1]}>` }) })
                    .catch(console.error);

            console.error(error);
            return message.reply({ content: i18n.__("common.errorCommand") }).catch(console.error);
        }
    }
    else if (queue) {
        queue.songs.forEach((value) => {
            fav.set(message, value)
        })
    }
    else {
        return (message.channel as TextChannel)
            .send({ content: i18n.__("favorite.notPlaying") })
            .catch(console.error);
    }

    fav.save()
    return (message.channel as TextChannel)
        .send({ content: i18n.__("favorite.resultAdd") })
        .catch(console.error);
}