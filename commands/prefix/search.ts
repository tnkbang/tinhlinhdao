import {
    ActionRowBuilder,
    Message,
    StringSelectMenuBuilder,
    StringSelectMenuInteraction
} from "discord.js";
import { i18n } from "../../utils/i18n";
import youtube, { Video } from 'youtube-sr';
import play from "./play";
import { CommandType } from "../../interfaces/Command";
import { bot } from './../../index';

export default {
    data: {
        name: 'search',
        sname: 's',
        type: CommandType.Music,
        description: i18n.__("search.description"),
        fields: [
            {
                name: i18n.__("common.fieldsUse"),
                value: `• **${bot.prefix}search <url>**` + '\n' +
                    `• **${bot.prefix}s <url>**` + '\n' +
                    i18n.__("search.usage")
            }
        ]
    },
    async execute(message: Message, input: string) {
        if (!input) return message.reply({ content: i18n.__("search.errorInput") }).catch(console.error)
        const query = input
        const member = message.guild!.members.cache.get(message.author.id);

        if (!member?.voice.channel)
            return message.reply({ content: i18n.__("search.errorNotChannel") }).catch(console.error);

        const search = query;

        const repMsg = await message.reply("⏳ Loading...")

        let results: Video[] = [];

        try {
            results = await youtube.search(search, { limit: 10, type: "video" });
        } catch (error: any) {
            console.error(error);

            return message.reply({ content: i18n.__("common.errorCommand") }).catch(console.error);
        }

        if (!results || !results[0]) return message.reply({ content: i18n.__("search.noResults") });

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

        await repMsg.edit({
            content: "Choose songs to play",
            components: [row]
        });

        repMsg.awaitMessageComponent({
            time: 30000
        })
            .then((selectInteraction) => {
                if (!(selectInteraction instanceof StringSelectMenuInteraction)) return;

                selectInteraction.update({ content: "⏳ Loading the selected songs...", components: [] });

                play.execute(message, selectInteraction.values[0])
                    .then(() => {
                        selectInteraction.values.slice(1).forEach((url) => {
                            play.execute(message, url, true)
                        })
                    })
            })
            .catch(console.error);
    }
}