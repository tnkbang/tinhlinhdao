import {
    Message,
    MessageReaction,
    TextChannel,
    User
} from "discord.js";
import { bot } from './../../index';
import { i18n } from "../../utils/i18n";
import { generateQueueEmbed } from "../Helper";

export default {
    data: { name: 'queue', sname: 'q' },
    async execute(message: Message) {
        const queue = bot.queues.get(message.guild!.id);
        if (!queue || !queue.songs.length) return message.reply({ content: i18n.__("queue.errorNotQueue") });

        let currentPage = 0;
        const embeds = generateQueueEmbed(message, queue.songs);

        const repMsg = await message.reply("⏳ Loading queue...");
        const editMsg = await repMsg.edit({
            content: `**${i18n.__mf("queue.currentPage")} ${currentPage + 1}/${embeds.length}**`,
            embeds: [embeds[currentPage]]
        });

        try {
            await editMsg.react("⬅️");
            await editMsg.react("⏹");
            await editMsg.react("➡️");
        } catch (error: any) {
            console.error(error);
            (message.channel as TextChannel).send(error.message).catch(console.error);
        }

        const filter = (reaction: MessageReaction, user: User) =>
            ["⬅️", "⏹", "➡️"].includes(reaction.emoji.name!) && message.author.id === user.id;

        const collector = editMsg.createReactionCollector({ filter, time: 60000 });

        collector.on("collect", async (reaction, user) => {
            try {
                if (user.id != message.author.id) {
                    return reaction.users.remove(user)
                }

                if (reaction.emoji.name === "➡️") {
                    if (currentPage < embeds.length - 1) {
                        currentPage++;
                        editMsg.edit({
                            content: i18n.__mf("queue.currentPage", { page: currentPage + 1, length: embeds.length }),
                            embeds: [embeds[currentPage]]
                        });
                    }
                } else if (reaction.emoji.name === "⬅️") {
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