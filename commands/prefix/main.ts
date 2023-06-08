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
import fav from './fav';

const prefix = config.PREFIX

async function onRequestMessage(message: Message) {
    if (message.author.bot || !bot.client.user?.id) return;
    if (message.content.includes("@here") || message.content.includes("@everyone") || message.type == MessageType.Reply) return;

    const arrMsg = message.content.trim().split(/ +/);
    const startMsg = arrMsg.shift()?.toLowerCase();
    let command: string

    if (!startMsg?.startsWith(prefix) && !startMsg?.includes(bot.client.user?.id)) return

    if (startMsg.startsWith(prefix)) command = startMsg.slice(prefix.length)
    else command = arrMsg.shift()?.toLowerCase() || ""
    if (command == "") return

    const inputMsg = arrMsg.toString().replaceAll(',', ' ')

    switch (command) {
        case 'fav': {
            await fav.execute(message, inputMsg.trim())
            break;
        }
        case 'help': {
            await help.execute(message)
            break;
        }
        case 'invite': {
            await invite.execute(message)
            break;
        }
        case 'loop': {
            await loop.execute(message, undefined)
            break;
        }
        case 'lyrics': {
            await lyrics.execute(message)
            break;
        }
        case 'move': {
            await move.execute(message, arrMsg[0], arrMsg[1])
            break;
        }
        case 'nowplaying': {
            await nowplaying.execute(message)
            break;
        }
        case 'pause': {
            await pause.execute(message, undefined)
            break;
        }
        case 'ping': {
            await ping.execute(message)
            break;
        }
        case 'play': {
            await play.execute(message, inputMsg.trim(), false)
            break;
        }
        case 'p': {
            await play.execute(message, inputMsg.trim(), false)
            break;
        }
        case 'playlist': {
            await playlist.execute(message, inputMsg.trim())
            break;
        }
        case 'queue': {
            await queue.execute(message)
            break;
        }
        case 'remove': {
            await remove.execute(message, arrMsg[0])
            break;
        }
        case 'resume': {
            await resume.execute(message, undefined)
            break;
        }
        case 'search': {
            await search.execute(message, inputMsg.trim())
            break;
        }
        case 'shuffle': {
            await shuffle.execute(message, undefined)
            break;
        }
        case 'skip': {
            await skip.execute(message, undefined)
            break;
        }
        case 'skipto': {
            await skipto.execute(message, arrMsg[0])
            break;
        }
        case 'sleep': {
            await sleep.execute(message)
            break;
        }
        case 'status': {
            await status.execute(message, arrMsg[0], inputMsg.replace(arrMsg[0], '').trim())
            break;
        }
        case 'stop': {
            await stop.execute(message, undefined, false)
            break;
        }
        case 'uptime': {
            await uptime.execute(message)
            break;
        }
        case 'volume': {
            await volume.execute(message, arrMsg[0])
            break;
        }
        default: {
            message.reply('Hãy dùng: `/help` để lấy thông tin sử dụng !');
            break;
        }
    }
}

export default onRequestMessage