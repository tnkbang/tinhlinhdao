import {
    Message,
    MessageReaction,
    TextChannel,
    User
} from "discord.js";
import { bot } from './../../index';
import { i18n } from "../../utils/i18n";
import { generateQueueEmbed } from "../Helper";
import { CommandType } from "../../interfaces/Command";
import { Icon } from "../../utils/icon";

export default {
    data: {
        name: 'queue',
        sname: 'q',
        type: CommandType.Music,
        description: i18n.__("queue.description"),
        fields: [
            {
                name: i18n.__("common.fieldsUse"),
                value: `• **${bot.prefix}queue**` + '\n' +
                    `• **${bot.prefix}q**`
            }
        ]
    },
    async execute(message: Message) {
        const queue = bot.queues.get(message.guild!.id);
        if (!queue || !queue.songs.length) return message.reply({ content: i18n.__("queue.errorNotQueue") });

        let currentPage = 0;
        const embeds = generateQueueEmbed(message, queue.songs);

        const repMsg = await message.reply("⏳ Loading queue...");
        const editMsg = await repMsg.edit({
            content: i18n.__mf("queue.currentPage", { page: currentPage + 1, length: embeds.length }),
            embeds: [embeds[currentPage]]
        });

        //if page = 1 then not set collection
        if (embeds.length == 1) return;

        try {
            await editMsg.react(Icon.LeftArrow);
            await editMsg.react(Icon.Stop);
            await editMsg.react(Icon.RightArrow);
        } catch (error: any) {
            console.error(error);
            (message.channel as TextChannel).send(error.message).catch(console.error);
        }

        const filter = (reaction: MessageReaction, user: User) =>
            [Icon.LeftArrow, Icon.Stop, Icon.RightArrow].includes(reaction.emoji.id!) && message.author.id === user.id;

        const collector = editMsg.createReactionCollector({ filter, time: 60000 });

        collector.on("collect", async (reaction, user) => {
            try {
                if (user.id != message.author.id) {
                    return reaction.users.remove(user)
                }

                if (reaction.emoji.id === Icon.RightArrow) {
                    if (currentPage < embeds.length - 1) {
                        currentPage++;
                        editMsg.edit({
                            content: i18n.__mf("queue.currentPage", { page: currentPage + 1, length: embeds.length }),
                            embeds: [embeds[currentPage]]
                        });
                    }
                } else if (reaction.emoji.id === Icon.LeftArrow) {
                    if (currentPage !== 0) {
                        --currentPage;
                        editMsg.edit({
                            content: i18n.__mf("queue.currentPage", { page: currentPage + 1, length: embeds.length }),
                            embeds: [embeds[currentPage]]
                        });
                    }
                } else {
                    collector.stop();
                    reaction.message.reactions.removeAll();
                }
                await reaction.users.remove(user);
            } catch (error: any) {
                console.error(error);
                return (message.channel as TextChannel).send(error.message).catch(console.error);
            }
        });
    }
}