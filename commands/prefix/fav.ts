import {
    Message, TextChannel
} from "discord.js";
import { Favorite } from "../../structs/Favorite";
import play from "./play";
import { bot } from "../..";
import { i18n } from "../../utils/i18n";

export default {
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

        if (!input) {
            fav.value.USER.map(value => {
                if (value.USER_ID == message.author.id) {
                    play.execute(message, value.MUSICS.shift()?.URL || "", true)
                        .then(() => {
                            value.MUSICS.slice(0).forEach((value) => {
                                play.execute(message, value.URL, true)
                            })
                        })
                }
            })

        }
        else {
            return (message.channel as TextChannel)
                .send({ content: "Chưa thiết đặt lệnh" })
                .catch(console.error);
        }
    }
}