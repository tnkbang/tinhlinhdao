import { bot } from './../../index';
import { i18n } from "../../utils/i18n";
import { config } from '../../utils/config';
import { Message, MessageType } from 'discord.js'
import { Icon } from '../../utils/icon';

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

    const inputMsg = arrMsg.toString().replaceAll(',', ' ').trim().toLowerCase()

    if (!bot.prefixCommandsMap.get(command))
        return message.reply({ content: i18n.__mf("help.errInput", { command: `${prefix}help` }) }).catch(console.error);

    message.react(Icon.Wait).catch(console.error)
    await bot.prefixCommandsMap.get(command)!.execute(message, inputMsg)
    return message.reactions.removeAll()
}

export default onRequestMessage