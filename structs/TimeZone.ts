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

    //get user time zone
    public getUserZone(uid: string, zone: TimeZone) {
        const check = Object.prototype.hasOwnProperty.call(zone.value, uid);
        if (check) return zone.value[uid];

        return config.UTC;
    }

    //set time zone
    public set(uid: string, input: number) {
        this.value[uid] = input
    }

    public save() {
        const json = JSON.stringify(this.value);
        fs.writeFileSync(filePath, json, 'utf8');
    }
}