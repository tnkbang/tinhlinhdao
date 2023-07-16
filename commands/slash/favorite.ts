import { bot } from './../../index';
import { i18n } from "../../utils/i18n";
import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, TextChannel, VoiceBasedChannel } from "discord.js";
import { Favorite } from '../../structs/Favorite';
import { Command, CommandPrefix } from '../../interfaces/Command';
import { randomColor } from '../../utils/color';
import { Song, SongData } from '../../structs/Song';
import { MusicQueue } from '../../structs/MusicQueue';
import { DiscordGatewayAdapterCreator, joinVoiceChannel } from '@discordjs/voice';

export default {
    data: new SlashCommandBuilder().setName("favorite").setDescription(i18n.__("favorite.description"))
        .addStringOption((option) => option.setName("action")
            .setDescription(i18n.__("favorite.inputAction")))
        .addStringOption((option) => option.setName("args")
            .setDescription(i18n.__("favorite.inputArgs"))),
    async execute(interaction: ChatInputCommandInteraction) {
        const type = interaction.options.getString('action')
        const input = interaction.options.getString('args')

        createCollectionCommand()
        const fav = new Favorite();
        fav.get();

        const guildMember = interaction.guild!.members.cache.get(interaction.user.id);
        const { channel } = guildMember!.voice;

        if (!channel)
            return interaction.reply({ content: i18n.__("play.errorNotChannel") }).catch(console.error);

        const queue = bot.queues.get(interaction.guild!.id);

        if (queue && channel.id !== queue.connection.joinConfig.channelId)
            return interaction
                .reply({
                    content: i18n.__mf("play.errorNotInSameChannel", { user: bot.client.user!.username })
                })
                .catch(console.error);

        if (!type && input) return interaction.reply({ content: i18n.__("favorite.errInput") }).catch(console.error);
        if (!type) return read(interaction, fav)

        if (!bot.favCommandsMap.get(type)) return interaction.reply({ content: i18n.__("favorite.errInput") }).catch(console.error);
        return await bot.favCommandsMap.get(type)?.execute(fav, input, interaction, queue, channel)
    }
}

//when first call then create collection
function createCollectionCommand() {
    if (!bot.favCommandsMap.get('add')) {
        const favKey = ['add', 'a', 'play', 'p', 'remove', 'r']
        const favOption = [add, add, play, play, remove, remove]

        favOption.forEach((value, index) => {
            const cmd: Command = {
                execute: value
            }
            bot.favCommandsMap.set(favKey[index], cmd)
        })
    }
}

function read(interaction: ChatInputCommandInteraction, fav: Favorite) {
    if (!fav.isUser(interaction.user.id, fav.value))
        return interaction
            .reply({ content: i18n.__("favorite.notFavorite") })
            .catch(console.error);

    let notMusic = fav.notMusic(interaction.user.id, fav)
    if (notMusic) return interaction.reply({ content: i18n.__("favorite.notFavorite") }).catch(console.error);

    let favEmbed = new EmbedBuilder()
        .setTitle(i18n.__("favorite.title"))
        .setColor(randomColor())
        .setTimestamp();

    favEmbed.setDescription(fav.value[interaction.user.id].map((value: SongData, index: number) => `${index + 1}. ${value.title}`).join("\n"))

    return interaction.reply({ embeds: [favEmbed] }).catch(console.error);
}

function play(fav: Favorite, input: string, interaction: ChatInputCommandInteraction, queue: MusicQueue, channel: VoiceBasedChannel) {
    interaction.deferReply()

    //not fav then exception
    let notMusic = fav.notMusic(interaction.user.id, fav)
    if (notMusic) return interaction.reply({ content: i18n.__("favorite.notFavorite") }).catch(console.error);

    let lstFav: Song[] = []
    fav.value[interaction.user.id].map((value: SongData) => lstFav.push(new Song(value)))

    if (queue) {
        queue.songs.push(...lstFav)
        return interaction
            .reply({ content: i18n.__("favorite.resultPlay") })
            .catch(console.error);
    } else {
        const newQueue = new MusicQueue({
            interaction,
            textChannel: interaction.channel! as TextChannel,
            connection: joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator
            })
        });

        bot.queues.set(interaction.guild!.id, newQueue);
        newQueue.enqueue(...lstFav)
    }

    return interaction.deleteReply()
}

async function add(fav: Favorite, input: string, interaction: ChatInputCommandInteraction, queue: MusicQueue) {
    interaction.deferReply()

    if (input) {
        let song;
        try {
            song = await Song.from(input, input);
            fav.set(interaction.user.id, song)
        } catch (error: any) {
            if (error.name == "NoResults") {
                return interaction
                    .reply({ content: i18n.__mf("play.errorNoResults", { url: `<${input}>` }) })
                    .catch(console.error);
            }
            if (error.name == "InvalidURL") {
                return interaction
                    .reply({ content: i18n.__mf("play.errorInvalidURL", { url: `<${input}>` }) })
                    .catch(console.error);
            }

            console.error(error);
            return interaction.reply({ content: i18n.__("common.errorCommand") }).catch(console.error);
        }
    }
    else if (queue) {
        queue.songs.forEach((value) => {
            fav.set(interaction.user.id, value)
        })
    }
    else {
        interaction.deleteReply()
        return (interaction.channel as TextChannel)
            .send({ content: i18n.__("favorite.notPlaying") })
            .catch(console.error);
    }

    fav.save()
    interaction.deleteReply()
    return (interaction.channel as TextChannel)
        .send({ content: i18n.__("favorite.resultAdd") })
        .catch(console.error);
}

function remove(fav: Favorite, input: string, interaction: ChatInputCommandInteraction) {
    if (!fav.isUser(interaction.user.id, fav.value))
        return interaction
            .reply({ content: i18n.__("favorite.notFavorite") })
            .catch(console.error);

    let arrRemove: SongData[] = []
    if (!input) return interaction.reply({ content: i18n.__("favorite.notInput") }).catch(console.error);
    const arrMsg = input.split(' ')
    if (arrMsg.length == 0) return interaction.reply({ content: i18n.__("favorite.notInput") }).catch(console.error);
    //input not number, return
    const inputValid = arrMsg.some(value => {
        if (!Number.parseInt(value)) return true
    })
    if (inputValid) return interaction.reply({ content: i18n.__("favorite.errInput") }).catch(console.error);

    //setup remove
    const uid = interaction.user.id;
    arrMsg.forEach(i => {
        const number = Number.parseInt(i)
        if (fav.value[uid][number - 1]) arrRemove.push(fav.value[uid][number - 1])
    })
    fav.value[uid] = fav.value[uid].filter(ar => !arrRemove.find(rm => (rm.url === ar.url)))

    fav.save()
    return interaction
        .reply({ content: i18n.__("favorite.resultRemove") })
        .catch(console.error);
}