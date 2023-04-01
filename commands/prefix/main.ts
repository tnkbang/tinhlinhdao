import { bot } from './../../index';
import { config } from '../../utils/config';
import { Message, MessageType } from 'discord.js'
import play from './play';
import help from './help';
import invite from './invite';
import ping from './ping';
import loop from './loop';
import lyrics from './lyrics';
import move from './move';
import nowplaying from './nowplaying';
import pause from './pause';
import playlist from './playlist';
import queue from './queue';
import remove from './remove';
import resume from './resume';
import search from './search';
import shuffle from './shuffle';
import skip from './skip';
import skipto from './skipto';
import sleep from './sleep';
import status from './status';
import stop from './stop';
import uptime from './uptime';
import volume from './volume';

const prefix = config.PREFIX

async function onRequestMessage(message: Message) {
    if (message.author.bot) return;
    if (message.content.includes("@here") || message.content.includes("@everyone") || message.type == MessageType.Reply) return;

    if (message.content.startsWith(`<@${bot.client.user?.id}>`)
        || message.content.startsWith(`<@!${bot.client.user?.id}>`)) {
        message.reply('Hãy dùng: `/help` để lấy thông tin sử dụng !');
    }

    const arrMsg = message.content.split(' ')

    switch (arrMsg[0]) {
        case `${prefix}help`:
            await help.execute(message)
            break;
        case `${prefix}invite`:
            await invite.execute(message)
            break;
        case `${prefix}loop`:
            await loop.execute(message)
            break;
        case `${prefix}lyrics`:
            await lyrics.execute(message)
            break;
        case `${prefix}move`:
            await move.execute(message, arrMsg[1], arrMsg[2])
            break;
        case `${prefix}nowplaying`:
            await nowplaying.execute(message)
            break;
        case `${prefix}pause`:
            await pause.execute(message, '', undefined)
            break;
        case `${prefix}ping`:
            await ping.execute(message)
            break;
        case `${prefix}play`:
            const songName = message.content.replace(arrMsg[0], '').trim()
            await play.execute(message, songName, false)
            break;
        case `${prefix}playlist`:
            await playlist.execute(message, message.content.replace(arrMsg[0], '').trim())
            break;
        case `${prefix}queue`:
            await queue.execute(message)
            break;
        case `${prefix}remove`:
            await remove.execute(message, arrMsg[1])
            break;
        case `${prefix}resume`:
            await resume.execute(message)
            break;
        case `${prefix}search`:
            await search.execute(message, message.content.replace(arrMsg[0], '').trim())
            break;
        case `${prefix}shuffle`:
            await shuffle.execute(message)
            break;
        case `${prefix}skip`:
            await skip.execute(message)
            break;
        case `${prefix}skipto`:
            await skipto.execute(message, arrMsg[1])
            break;
        case `${prefix}sleep`:
            await sleep.execute(message)
            break;
        case `${prefix}status`:
            await status.execute(message, arrMsg[1], message.content.replace(arrMsg[0] + ' ' + arrMsg[1], '').trim())
            break;
        case `${prefix}stop`:
            await stop.execute(message, false)
            break;
        case `${prefix}uptime`:
            await uptime.execute(message)
            break;
        case `${prefix}volume`:
            await volume.execute(message, arrMsg[1])
            break;
    }
}

export default onRequestMessage