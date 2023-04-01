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
    async execute(message: Message) {
        const queue = bot.queues.get(message.guild!.id);
        if (!queue || !queue.songs.length) return message.reply({ content: i18n.__("queue.errorNotQueue") });

        let currentPage = 0;
        const embeds = generateQueueEmbed(message, queue.songs);

        await message.reply("⏳ Loading queue...");

        await message.reply({
            content: `**${i18n.__mf("queue.currentPage")} ${currentPage + 1}/${embeds.length}**`,
            embeds: [embeds[currentPage]]
        });

        const queueEmbed = await message.fetch()

        try {
            await queueEmbed.react("⬅️");
            await queueEmbed.react("⏹");
            await queueEmbed.react("➡️");
        } catch (error: any) {
            console.error(error);
            (message.channel as TextChannel).send(error.message).catch(console.error);
        }

        const filter = (reaction: MessageReaction, user: User) =>
            ["⬅️", "⏹", "➡️"].includes(reaction.emoji.name!) && message.author.id === user.id;

        const collector = queueEmbed.createReactionCollector({ filter, time: 60000 });

        collector.on("collect", async (reaction, user) => {
            try {
                if (reaction.emoji.name === "➡️") {
                    if (currentPage < embeds.length - 1) {
                        currentPage++;
                        queueEmbed.edit({
                            content: i18n.__mf("queue.currentPage", { page: currentPage + 1, length: embeds.length }),
                            embeds: [embeds[currentPage]]
                        });
                    }
                } else if (reaction.emoji.name === "⬅️") {
                    if (currentPage !== 0) {
                        --currentPage;
                        queueEmbed.edit({
                            content: i18n.__mf("queue.currentPage", { page: currentPage + 1, length: embeds.length }),
                            embeds: [embeds[currentPage]]
                        });
                    }
                } else {
                    collector.stop();
                    reaction.message.reactions.removeAll();
                }
                await reaction.users.remove(message.author.id);
            } catch (error: any) {
                console.error(error);
                return (message.channel as TextChannel).send(error.message).catch(console.error);
            }
        });
    }
}