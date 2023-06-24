import { Message } from "discord.js";
import path from "path";
import { SongData } from './Song';
const fs = require('fs');
const filePath = path.join(__dirname, "..", "data", "favorite.json")

export interface Fav {
    uid: string;
    musics: SongData[]
}
export class Favorite {
    public value: Fav[];
    public get() {
        try {
            const jsonString = fs.readFileSync(filePath);
            this.value = JSON.parse(jsonString);
        } catch (error) {
            this.value = []
        }
    }

    public isUser(message: Message, fav: Fav[]) {
        return fav.some(value => {
            if (value.uid == message.author.id) return true
        })
    }

    public notMusic(message: Message, fav: Favorite) {
        return fav.value.some(value => {
            if (value.uid == message.author.id) {
                if (value.musics.length == 0) return true
            }
        })
    }

    private isFavorite(songs: SongData[], url: string) {
        return songs.some(value => {
            if (value.url == url) return true
        })
    }

    public set(message: Message, song: SongData) {
        if (this.isUser(message, this.value)) {
            this.value.some(value => {
                if (value.uid == message.author.id) {
                    if (!this.isFavorite(value.musics, song.url)) {
                        value.musics.push(song)
                    }

                    return true
                }
            })
        }
        else {
            const fav: Fav = {
                uid: message.author.id,
                musics: []
            }
            fav.musics.push(song)

            this.value.push(fav)
        }
    }

    public save() {
        const json = JSON.stringify(this.value);
        fs.writeFileSync(filePath, json, 'utf8');
    }
}