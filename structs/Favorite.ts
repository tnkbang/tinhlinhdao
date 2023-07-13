import { Message } from "discord.js";
import path from "path";
import { SongData } from './Song';
import { config } from "../utils/config";
const fs = require('fs');
const filePath = path.join(__dirname, "..", "data", "favorite.json")

export interface Fav {
    [x: string]: SongData[]
}
export class Favorite {
    public value: Fav;
    public get() {
        try {
            const jsonString = fs.readFileSync(filePath);
            this.value = JSON.parse(jsonString);
        } catch (error) {
            //set first fav
            const ownID = config.OWNER
            const firstFav: Fav = {
                [ownID]: []
            }
            this.value = firstFav
        }
    }

    public isUser(message: Message, fav: Fav) {
        const check = Object.prototype.hasOwnProperty.call(fav, message.author.id);
        return check
    }

    public notMusic(message: Message, fav: Favorite) {
        if (!this.isUser(message, this.value)) return true
        if (fav.value[message.author.id] && fav.value[message.author.id].length == 0) return true
        return false
    }

    private isFavorite(songs: SongData[], url: string) {
        return songs.some(value => {
            if (value.url == url) return true
        })
    }

    public set(message: Message, song: SongData) {
        //exist user
        if (this.isUser(message, this.value)) {
            const userFav = this.value[message.author.id];

            //add if not fav
            if (!this.isFavorite(userFav, song.url)) {
                this.value[message.author.id].push(song)
            }
        }
        else {
            this.value[message.author.id] = []
            this.value[message.author.id].push(song)
        }
    }

    public save() {
        const json = JSON.stringify(this.value);
        fs.writeFileSync(filePath, json, 'utf8');
    }
}