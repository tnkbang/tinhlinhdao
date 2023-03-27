import { i18n } from "./../../utils/i18n";
import { ChatInputCommandInteraction } from "discord.js";

function getTime(date: Date) {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? "PM" : "AM"

    const hh = hours.toString().length < 2 ? "0" + hours.toString() : hours
    const mm = minutes.toString().length < 2 ? "0" + minutes.toString() : minutes

    return hh + ":" + mm + " " + ampm
}

function addMinutes(date: Date, minutes: number) {
    date.setTime(date.getTime() + minutes * 60 * 1000);
    return date;
}

function getStringHours(cycle: number) {
    switch (cycle) {
        case 3: return "bốn tiếng rưỡi."
        case 4: return "sáu tiếng."
        case 5: return "bảy tiếng rưỡi."
    }
}

function getLocalDateTime() {
    const strTime = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Ho_Chi_Minh'
    })
    return new Date(strTime)
}

function getContentSleeping(dateTime: Date) {
    let strResult = ""

    for (let i = 3; i < 6; i++) {
        const tempDTime = new Date(dateTime)
        const minutes = (90 * i) + 14
        const cycleTime = addMinutes(tempDTime, minutes)
        const perTime = getStringHours(i)

        strResult += '\n'
        strResult += i18n.__mf("sleep.strContent", { time: getTime(cycleTime), cycle: i, sleeping: perTime })
    }

    return strResult
}

function setSleep(interaction: ChatInputCommandInteraction) {
    const dateTime = getLocalDateTime()

    let title = i18n.__mf("sleep.strInfo", { time: getTime(dateTime) })
    let strResult = title
    strResult += getContentSleeping(dateTime)

    return interaction
        .reply({ content: strResult })
        .catch(console.error);
}

export default setSleep