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

    public isUser(uid: string, fav: Fav) {
        const check = Object.prototype.hasOwnProperty.call(fav, uid);
        return check
    }

    public notMusic(uid: string, fav: Favorite) {
        if (!this.isUser(uid, this.value)) return true
        if (fav.value[uid] && fav.value[uid].length == 0) return true
        return false
    }

    private isFavorite(songs: SongData[], url: string) {
        return songs.some(value => {
            if (value.url == url) return true
        })
    }

    public set(uid: string, song: SongData) {
        //exist user
        if (this.isUser(uid, this.value)) {
            const userFav = this.value[uid];

            //add if not fav
            if (!this.isFavorite(userFav, song.url)) {
                this.value[uid].push(song)
            }
        }
        else {
            this.value[uid] = []
            this.value[uid].push(song)
        }
    }

    public save() {
        const json = JSON.stringify(this.value);
        fs.writeFileSync(filePath, json, 'utf8');
    }
}