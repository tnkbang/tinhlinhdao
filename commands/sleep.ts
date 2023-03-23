import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
//import { bot } from "../index";
import { i18n } from "../utils/i18n";

function getTime(date: Date) {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? "PM" : "AM"

    return hours + ":" + minutes + " " + ampm
}

function addMinutes(date: Date, minutes: number) {
    date.setTime(date.getTime() + minutes * 60 * 1000);
    return date;
}

function getStringHours(cycle: number) {
    switch (cycle) {
        case 3: return " bốn tiếng rưỡi."
        case 4: return " sáu tiếng."
        case 5: return " bảy tiếng rưỡi."
    }
}

export default {
    data: new SlashCommandBuilder().setName("sleep").setDescription(i18n.__("sleep.description")),
    execute(interaction: ChatInputCommandInteraction) {
        const strTime = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Ho_Chi_Minh'
        })
        const dateTime = new Date(strTime)

        let title = i18n.__mf("sleep.strInfo", { time: getTime(dateTime) })
        let strResult = title

        for (let i = 3; i < 6; i++) {
            const minutes = (90 * i) + 14
            const cycleTime = addMinutes(dateTime, minutes)
            const perTime = getStringHours(i)

            strResult += '\n'
            strResult += i18n.__mf("sleep.strContent", { time: getTime(cycleTime), cycle: i, sleeping: perTime })
        }

        return interaction
            .reply({ content: strResult })
            .catch(console.error);
    }
};
