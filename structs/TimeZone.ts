import { Message } from "discord.js";
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

    public isUser(message: Message, zone: UserZone) {
        const check = Object.prototype.hasOwnProperty.call(zone, message.author.id);
        return check
    }

    public getUserZone(message: Message, zone: TimeZone) {
        if (!this.isUser(message, this.value)) return config.UTC;
        return zone.value[message.author.id];
    }

    public set(message: Message, input: number) {
        this.value[message.author.id] = input
    }

    public save() {
        const json = JSON.stringify(this.value);
        fs.writeFileSync(filePath, json, 'utf8');
    }
}