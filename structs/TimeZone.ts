import { Interaction, Message } from "discord.js";
import path from "path";
import { config } from "../utils/config";
const fs = require('fs');
const filePath = path.join(__dirname, "..", "data", "timezone.json")

export interface UserZone {
    [x: string]: number
}
export class TimeZone {
    public value: UserZone;
    public get() {
        try {
            const jsonString = fs.readFileSync(filePath);
            this.value = JSON.parse(jsonString);
        } catch (error) {
            //set first time zone
            const ownID = config.OWNER
            const firstZone: UserZone = {
                [ownID]: config.UTC
            }
            this.value = firstZone
        }
    }

    //check user with message
    public mIsUser(message: Message, zone: UserZone) {
        const check = Object.prototype.hasOwnProperty.call(zone, message.author.id);
        return check
    }

    //check user with interaction
    public iIsUser(interaction: Interaction, zone: UserZone) {
        const check = Object.prototype.hasOwnProperty.call(zone, interaction.user.id);
        return check
    }

    //get user zone with message
    public mGetUserZone(message: Message, zone: TimeZone) {
        if (!this.mIsUser(message, this.value)) return config.UTC;
        return zone.value[message.author.id];
    }

    //get user zone with interaction
    public iGetUserZone(interaction: Interaction, zone: TimeZone) {
        if (!this.iIsUser(interaction, this.value)) return config.UTC;
        return zone.value[interaction.user.id];
    }

    //set time zone with message
    public mSet(message: Message, input: number) {
        this.value[message.author.id] = input
    }

    //set time zone with interaction
    public iSet(interaction: Interaction, input: number) {
        this.value[interaction.user.id] = input
    }

    public save() {
        const json = JSON.stringify(this.value);
        fs.writeFileSync(filePath, json, 'utf8');
    }
}