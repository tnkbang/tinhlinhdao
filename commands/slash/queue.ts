import {
    ChatInputCommandInteraction,
    MessageReaction,
    PermissionsBitField,
    SlashCommandBuilder,
    TextChannel,
    User
} from "discord.js";
import { bot } from './../../index';
import { i18n } from "../../utils/i18n";
import { generateQueueEmbed } from "../Helper";
import { Icon } from "../../utils/icon";

export default {
    data: new SlashCommandBuilder().setName("queue").setDescription(i18n.__("queue.description")),
    cooldown: 5,
    permissions: [PermissionsBitField.Flags.AddReactions, PermissionsBitField.Flags.ManageMessages],
    async execute(interaction: ChatInputCommandInteraction) {
        const queue = bot.queues.get(interaction.guild!.id);
        if (!queue || !queue.songs.length) return interaction.reply({ content: i18n.__("queue.errorNotQueue") });

        let currentPage = 0;
        const embeds = generateQueueEmbed(interaction, queue.songs);

        await interaction.reply("⏳ Loading queue...");

        if (interaction.replied)
            await interaction.editReply({
                content: i18n.__mf("queue.currentPage", { page: currentPage + 1, length: embeds.length }),
                embeds: [embeds[currentPage]]
            });

        const queueEmbed = await interaction.fetchReply();

        //if page = 1 then not set collection
        if (embeds.length == 1) return;

        try {
            await queueEmbed.react(Icon.LeftArrow);
            await queueEmbed.react(Icon.Stop);
            await queueEmbed.react(Icon.RightArrow);
        } catch (error: any) {
            console.error(error);
            (interaction.channel as TextChannel).send(error.message).catch(console.error);
        }

        const filter = (reaction: MessageReaction, user: User) =>
            [Icon.LeftArrow, Icon.Stop, Icon.RightArrow].includes(reaction.emoji.id!) && interaction.user.id === user.id;

        const collector = queueEmbed.createReactionCollector({ filter, time: 60000 });

        collector.on("collect", async (reaction, user) => {
            try {
                if (user.id != interaction.user.id) {
                    return reaction.users.remove(user)
                }

                if (reaction.emoji.id === Icon.RightArrow) {
                    if (currentPage < embeds.length - 1) {
                        currentPage++;
                        queueEmbed.edit({
                            content: i18n.__mf("queue.currentPage", { page: currentPage + 1, length: embeds.length }),
                            embeds: [embeds[currentPage]]
                        });
                    }
                } else if (reaction.emoji.id === Icon.LeftArrow) {
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
                await reaction.users.remove(user);
            } catch (error: any) {
                console.error(error);
                return (interaction.channel as TextChannel).send(error.message).catch(console.error);
            }
        });
    }
}