import { bot } from "./../../index";
import { i18n } from "./../../utils/i18n";
import { ChatInputCommandInteraction } from "discord.js";

function setUptime(interaction: ChatInputCommandInteraction) {
    let seconds = Math.floor(bot.client.uptime! / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    seconds %= 60;
    minutes %= 60;
    hours %= 24;

    return interaction
        .reply({ content: i18n.__mf("uptime.result", { days: days, hours: hours, minutes: minutes, seconds: seconds }) })
        .catch(console.error);
}
export default setUptime