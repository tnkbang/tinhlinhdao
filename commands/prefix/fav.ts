import { CommandPrefix, CommandType } from './../../interfaces/Command';
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

//when first call then create collection
if (bot.favCommandsMap.size == 0) {
    const favKey = ['add', 'a', 'play', 'p', 'remove', 'r']
    const favOption = [add, add, play, play, remove, remove]

    favOption.forEach((value, index) => {
        const cmd: CommandPrefix = {
            execute: value
        }
        bot.favCommandsMap.set(favKey[index], cmd)
    })
}

export default {
    data: {
        name: 'favorite',
        sname: 'fav;f',
        type: CommandType.Music,
        description: i18n.__("favorite.description"),
        fields: [
            {
                name: i18n.__("common.fieldsUse"),
                value: `• **${bot.prefix}favorite** : ` + i18n.__("favorite.fieldsList") + '\n' +
                    `• **${bot.prefix}favorite add <url>** : ` + i18n.__("favorite.fieldsAdd") + '\n' +
                    `• **${bot.prefix}favorite remove <id>** : ` + i18n.__("favorite.fieldsRemove") + '\n' +
                    `• **${bot.prefix}favorite play** : ` + i18n.__("favorite.fieldsPlay") + '\n'
            }, {
                name: i18n.__("common.fieldsShort"),
                value: '• favorite = fav = f\n' +
                    '• add = a\n' +
                    '• remove = r\n' +
                    '• play = p'
            }, {
                name: i18n.__("common.fieldsExample"),
                value: i18n.__("favorite.fieldsExample") + '\n' +
                    `• **${bot.prefix}favorite play**\n` +
                    `• **${bot.prefix}favorite p**\n` +
                    `• **${bot.prefix}fav play**\n` +
                    `• **${bot.prefix}fav p**\n` +
                    `• **${bot.prefix}f p**\n`
            }
        ]
    },
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

        if (!input) return read(message, fav)

        const arrMsg = input.split(' ')

        if (!bot.favCommandsMap.get(arrMsg[0])) return
        return await bot.favCommandsMap.get(arrMsg[0])?.execute(fav, arrMsg, message, queue, channel)
    }
}

function read(message: Message, fav: Favorite) {
    if (!fav.isUser(message.author.id, fav.value))
        return message
            .reply({ content: i18n.__("favorite.notFavorite") })
            .catch(console.error);

    let notMusic = fav.notMusic(message.author.id, fav)
    if (notMusic) return message.reply({ content: i18n.__("favorite.notFavorite") }).catch(console.error);

    let favEmbed = new EmbedBuilder()
        .setTitle(i18n.__("favorite.title"))
        .setColor(randomColor())
        .setTimestamp();

    favEmbed.setDescription(fav.value[message.author.id].map((value: SongData, index: number) => `${index + 1}. ${value.title}`).join("\n"))

    return message.reply({ embeds: [favEmbed] }).catch(console.error);
}

function play(fav: Favorite, arrMsg: string[], message: Message, queue: MusicQueue | MusicQueuePrefix | undefined, channel: VoiceBasedChannel) {

    //not fav then exception
    let notMusic = fav.notMusic(message.author.id, fav)
    if (notMusic) return message.reply({ content: i18n.__("favorite.notFavorite") }).catch(console.error);

    let lstFav: Song[] = []
    fav.value[message.author.id].map((value: SongData) => lstFav.push(new Song(value)))

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

async function add(fav: Favorite, arrMsg: string[], message: Message, queue: MusicQueue | MusicQueuePrefix | undefined) {
    if (arrMsg[1]) {
        let song;
        try {
            song = await Song.from(arrMsg[1], arrMsg[1]);
            fav.set(message.author.id, song)
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
            fav.set(message.author.id, value)
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

function remove(fav: Favorite, arrMsg: string[], message: Message) {
    if (!fav.isUser(message.author.id, fav.value))
        return message
            .reply({ content: i18n.__("favorite.notFavorite") })
            .catch(console.error);

    let arrRemove: SongData[] = []
    arrMsg = arrMsg.slice(1)
    if (arrMsg.length == 0) return message.reply({ content: i18n.__("favorite.notInput") }).catch(console.error);

    //input not number, return
    const inputValid = arrMsg.some(value => {
        if (!Number.parseInt(value)) return true
    })
    if (inputValid) return message.reply({ content: i18n.__("favorite.errInput") }).catch(console.error);

    //setup remove
    const uid = message.author.id;
    arrMsg.forEach(i => {
        const number = Number.parseInt(i)
        if (fav.value[uid][number - 1]) arrRemove.push(fav.value[uid][number - 1])
    })
    fav.value[uid] = fav.value[uid].filter(ar => !arrRemove.find(rm => (rm.url === ar.url)))

    fav.save()
    return (message.channel as TextChannel)
        .send({ content: i18n.__("favorite.resultRemove") })
        .catch(console.error);
}