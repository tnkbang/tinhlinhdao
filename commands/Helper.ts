import {
    ActionRowBuilder,
    ActivityType,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    CommandInteraction,
    EmbedBuilder,
    Message
} from "discord.js";
import { bot } from '../index';
import { i18n } from "../utils/i18n";
import { Song } from "../structs/Song";
import { randomColor } from "../utils/color";
import { TimeZone } from "../structs/TimeZone";

function setHelp(type: string) {
    let helpEmbed = new EmbedBuilder()
        .setDescription(i18n.__mf("help.embedDescription", { title: type }))
        .setColor(randomColor());

    //check not input
    if (!type) {
        const cmdHelp = bot.prefixCommandsMap.get('help')

        helpEmbed.setTitle(i18n.__mf("help.embedTitle", { botname: bot.client.user!.username }))
        helpEmbed.setDescription(cmdHelp?.data?.description || '')
        helpEmbed.addFields(cmdHelp?.data?.fields || [])
        helpEmbed.setTimestamp();

        return helpEmbed
    }

    //with command type
    const commands = getCommandOfType(type)
    if (commands.length > 0) {
        commands.forEach((cmd) => {
            helpEmbed.addFields({
                name: `**${cmd.name}**`,
                value: `${cmd.description}`,
                inline: true
            });
        });

        helpEmbed.setTitle(i18n.__mf("help.embedTitleCmdType", { type: type }))
        helpEmbed.setTimestamp();
        return helpEmbed
    }

    //with prefix command
    const cmd = bot.prefixCommandsMap.get(type)
    if (cmd) {
        helpEmbed.setTitle(i18n.__mf("help.embedTitleCmdName", { name: cmd.data?.name }))
        helpEmbed.setDescription(cmd.data?.description || '')
        helpEmbed.addFields(cmd.data?.fields || [])
    }
    else {
        helpEmbed.setTitle(i18n.__("help.embedNotValue"))
        helpEmbed.setDescription(i18n.__mf("help.notValue", { title: type }))
    }

    helpEmbed.setTimestamp();
    return helpEmbed
}

interface HelpOptions {
    name?: string,
    description?: string
}

function getCommandOfType(type: string) {
    const commands = bot.prefixCommandsMap
    let result: HelpOptions[] = []

    commands.forEach((cmd) => {
        if (cmd.data?.type == type) {
            const item: HelpOptions = {
                name: cmd.data?.name,
                description: cmd.data?.description
            }
            result.push(item)
        }
    })
    return result.filter((i, p, s) => s.findIndex(v => v.name === i.name) === p)
}

function setInvite() {
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
    )

    return { inviteEmbed, actionRow }
}

function getTime(date: Date) {
    const hours = date.getUTCHours()
    const minutes = date.getUTCMinutes()
    const ampm = hours >= 12 ? "PM" : "AM"

    const hh = hours.toString().length < 2 ? "0" + hours.toString() : hours
    const mm = minutes.toString().length < 2 ? "0" + minutes.toString() : minutes

    return hh + ":" + mm + " " + ampm
}

function addMinutes(date: Date, minutes: number) {
    date.setTime(date.getTime() + minutes * 60 * 1000);
    return date;
}

function getStringHours(cycle: number) {
    switch (cycle) {
        case 3: return (cycle + 1) + i18n.__("sleep.odd");
        case 4: return (cycle + 1) + i18n.__("sleep.even");
        case 5: return (cycle + 1) + i18n.__("sleep.odd");
    }
}

function getLocalDateTime(userZone: number) {
    const date = new Date();
    date.setTime(date.getTime() + userZone * 60 * 60 * 1000);

    return date;
}

function getContentSleeping(dateTime: Date) {
    let strResult = ""

    for (let i = 3; i < 6; i++) {
        const tempDTime = new Date(dateTime)
        const minutes = (90 * i) + 14
        const cycleTime = addMinutes(tempDTime, minutes)
        const perTime = getStringHours(i)

        strResult += '\n'
        strResult += i18n.__mf("sleep.strContent", { time: getTime(cycleTime), cycle: i, sleeping: perTime })
    }

    return strResult
}

function setSleep(interaction: ChatInputCommandInteraction | Message) {
    const zones = new TimeZone()
    zones.get()

    let userZone;
    if (interaction instanceof Message) userZone = zones.getUserZone(interaction.author.id, zones)
    else userZone = zones.getUserZone(interaction.user.id, zones)

    const dateTime = getLocalDateTime(userZone)

    let title = i18n.__mf("sleep.strInfo", { time: getTime(dateTime) })
    let strResult = title
    strResult += getContentSleeping(dateTime)

    return interaction
        .reply({ content: strResult })
        .catch(console.error);
}

function getTypeStatus(type: string | null) {
    type = type ? type.toLowerCase() : 'l'
    switch (type) {
        case 'p': return ActivityType.Playing
        case 'play': return ActivityType.Playing

        case 'w': return ActivityType.Watching
        case 'watch': return ActivityType.Watching

        case 'l': return ActivityType.Listening
        case 'listen': return ActivityType.Listening

        case 's': return ActivityType.Streaming
        case 'stream': return ActivityType.Streaming

        case 'c': return ActivityType.Custom
        case 'custom': return ActivityType.Custom

        case 'compet': return ActivityType.Competing

        default: return ActivityType.Playing
    }
}

function setUptime(interaction: ChatInputCommandInteraction | Message) {
    return interaction
        .reply({ content: i18n.__mf("uptime.result", { time: `<t:${Math.floor(Date.now() / 1000 - bot.client.uptime! / 1000)}:R>` }) })
        .catch(console.error);
}

function generateQueueEmbed(interaction: CommandInteraction | Message, songs: Song[]) {
    let embeds = [];
    let k = 10;

    for (let i = 0; i < songs.length; i += 10) {
        const current = songs.slice(i, k);
        let j = i;
        k += 10;

        const info = current.map((track) => `${++j} - [${track.title}](${track.url})`).join("\n");

        const embed = new EmbedBuilder()
            .setTitle(i18n.__("queue.embedTitle"))
            .setThumbnail(interaction.guild?.iconURL()!)
            .setColor(randomColor())
            .setDescription(i18n.__mf("queue.embedCurrentSong", { title: songs[0].title, url: songs[0].url, info: info }))
            .setTimestamp();
        embeds.push(embed);
    }

    return embeds;
}

export {
    setHelp,
    setInvite,
    setSleep,
    getTypeStatus,
    setUptime,
    generateQueueEmbed
}