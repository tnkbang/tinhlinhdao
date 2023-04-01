import {
    ActionRowBuilder,
    Message,
    StringSelectMenuBuilder,
    StringSelectMenuInteraction
} from "discord.js";
import { bot } from './../../index';
import { i18n } from "../../utils/i18n";
import youtube, { Video } from 'youtube-sr';
import play from "./play";

export default {
    async execute(message: Message, input: string) {
        if (!input) return message.reply({ content: i18n.__("search.errorInput") }).catch(console.error)
        const query = input
        const member = message.guild!.members.cache.get(message.author.id);

        if (!member?.voice.channel)
            return message.reply({ content: i18n.__("search.errorNotChannel") }).catch(console.error);

        const search = query;

        await message.reply("⏳ Loading...").catch(console.error);

        let results: Video[] = [];

        try {
            results = await youtube.search(search, { limit: 10, type: "video" });
        } catch (error: any) {
            console.error(error);

            message.reply({ content: i18n.__("common.errorCommand") }).catch(console.error);
        }

        if (!results) return;

        const options = results!.map((video) => {
            return {
                label: video.title ?? "",
                value: video.url
            };
        });

        const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId("search-select")
                .setPlaceholder("Nothing selected")
                .setMinValues(1)
                .setMaxValues(10)
                .addOptions(options)
        );

        const followUp = await message.reply({
            content: "Choose songs to play",
            components: [row]
        });

        followUp
            .awaitMessageComponent({
                time: 30000
            })
            .then((selectInteraction) => {
                if (!(selectInteraction instanceof StringSelectMenuInteraction)) return;

                selectInteraction.update({ content: "⏳ Loading the selected songs...", components: [] });

                bot.slashCommandsMap
                    .get("play")!
                    .execute(message, selectInteraction.values[0])
                    .then(() => {
                        selectInteraction.values.slice(1).forEach((url) => {
                            play.execute(message, url, true)
                        });
                    });
            })
            .catch(console.error);
    }
}