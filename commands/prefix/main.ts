import { bot } from './../../index';
import { i18n } from "../../utils/i18n";
import { config } from '../../utils/config';
import { Message, MessageType } from 'discord.js'
import { getTypeStatus, setHelp, setInvite, setSleep, setUptime } from '../Helper';

const prefix = config.PREFIX

function onRequestMessage(message: Message) {
    if (message.author.bot) return;
    if (message.content.includes("@here") || message.content.includes("@everyone") || message.type == MessageType.Reply) return;

    if (message.content.startsWith(`<@${bot.client.user?.id}>`)
        || message.content.startsWith(`<@!${bot.client.user?.id}>`)) {
        message.reply('Hãy dùng: `/help` để lấy thông tin sử dụng !');
    }

    const arrMsg = message.content.split(' ')

    switch (arrMsg[0]) {
        case `${prefix}help`:
            message.reply({ embeds: [setHelp()] }).catch(console.error)
            break;
        case `${prefix}invite`:
            generateInvite(message)
            break;
        case `${prefix}ping`:
            generatePing(message)
            break;
        case `${prefix}sleep`:
            setSleep(message)
            break;
        case `${prefix}status`:
            generateStatus(message)
            break;
        case `${prefix}uptime`:
            setUptime(message)
            break;
    }
}

function generateStatus(message: Message) {
    const ownerID = config.OWNER
    if (message.member?.user.id == ownerID) {
        const arrMsg = message.content.split(' ')
        const type = arrMsg[1]
        const value = message.content.replace(arrMsg[0] + ' ' + arrMsg[1], '').trim()

        if (!type || !value)
            return message.reply({ content: i18n.__("status.errInput") }).catch(console.error);

        const thisType = getTypeStatus(type)
        const thisVal = value ? value : '/help'

        bot.client.user?.setActivity({
            name: thisVal,
            type: thisType.valueOf()
        })

        return message.reply({ content: i18n.__("status.result") }).catch(console.error);
    }

    return message.reply({ content: i18n.__("status.missingPermission") }).catch(console.error);
}

function generatePing(message: Message) {
    message
        .reply({ content: i18n.__mf("ping.result", { ping: Math.round(message.client.ws.ping) }) })
        .catch(console.error);
}

function generateInvite(message: Message) {
    let invite = setInvite()
    message.reply({ embeds: [invite.inviteEmbed], components: [invite.actionRow] }).catch(console.error);
}

export default onRequestMessage