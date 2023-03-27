import { i18n } from "./../../utils/i18n";
import { ChatInputCommandInteraction } from "discord.js";

function setPing(interaction: ChatInputCommandInteraction) {
    interaction
        .reply({ content: i18n.__mf("ping.result", { ping: Math.round(interaction.client.ws.ping) }), ephemeral: true })
        .catch(console.error);
}
export default setPing