import { bot } from './../../index';
import { config } from '../../utils/config';
import { Message, MessageType } from 'discord.js'
import { setHelp } from '../Helper';

const prefix = config.PREFIX

function onRequestMessage(message: Message) {
    if (message.author.bot) return;
    if (message.content.includes("@here") || message.content.includes("@everyone") || message.type == MessageType.Reply) return;

    if (message.content.startsWith(`<@${bot.client.user?.id}>`)
        || message.content.startsWith(`<@!${bot.client.user?.id}>`)) {
        message.reply('Hãy dùng: `/help` để lấy thông tin sử dụng !');
    }

    if (message.content.startsWith(`${prefix}help`)) {
        message.reply({ embeds: [setHelp()] }).catch(console.error)
    }
}

export default onRequestMessage