import {
    ActionRowBuilder,
    ActivityType,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    CommandInteraction,
    EmbedBuilder
} from "discord.js";
import { bot } from '../../index';
import { i18n } from "../../utils/i18n";
import { config } from '../../utils/config';
import { randomColor } from "../../utils/color";

let helpEmbed: EmbedBuilder;

function setHelp(interaction: CommandInteraction) {
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

    return interaction.reply({ embeds: [helpEmbed] }).catch(console.error);
}

function setInvite(interaction: ChatInputCommandInteraction) {
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

    return interaction.reply({ embeds: [inviteEmbed], components: [actionRow] }).catch(console.error);
}

function setPing(interaction: ChatInputCommandInteraction) {
    interaction
        .reply({ content: i18n.__mf("ping.result", { ping: Math.round(interaction.client.ws.ping) }), ephemeral: true })
        .catch(console.error);
}

function getTime(date: Date) {
    const hours = date.getHours()
    const minutes = date.getMinutes()
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
        case 3: return "bốn tiếng rưỡi."
        case 4: return "sáu tiếng."
        case 5: return "bảy tiếng rưỡi."
    }
}

function getLocalDateTime() {
    const strTime = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Ho_Chi_Minh'
    })
    return new Date(strTime)
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

function setSleep(interaction: ChatInputCommandInteraction) {
    const dateTime = getLocalDateTime()

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

function setStatus(interaction: ChatInputCommandInteraction) {
    const ownerID = config.OWNER
    if (interaction.member?.user.id == ownerID) {
        const type = interaction.options.getString('type')
        const value = interaction.options.getString('value')

        const thisType = getTypeStatus(type)
        const thisVal = value ? value : '/help'

        bot.client.user?.setActivity({
            name: thisVal,
            type: thisType.valueOf()
        })

        return interaction
            .reply({ content: i18n.__("status.result") })
            .catch(console.error);
    }

    return interaction
        .reply({ content: i18n.__("status.missingPermission") })
        .catch(console.error);
}

function setUptime(interaction: ChatInputCommandInteraction) {
    let seconds = Math.floor(bot.client.uptime! / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    seconds %= 60;
    minutes %= 60;
    hours %= 24;

    return interaction
        .reply({ content: i18n.__mf("uptime.result", { days: days, hours: hours, minutes: minutes, seconds: seconds }) })
        .catch(console.error);
}

export {
    setHelp,
    setInvite,
    setPing,
    setSleep,
    setStatus,
    setUptime
}