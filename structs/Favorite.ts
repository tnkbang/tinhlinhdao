import { Message, TextChannel } from "discord.js";
import { SongData } from './Song';
const fs = require('fs');

export interface Fav {
    user: users[]
}

interface users {
    user_id: string;
    musics: SongData[]
}
export class Favorite {
    public value: Fav;
    public get() {
        try {
            const jsonString = fs.readFileSync(__dirname + "/data.json");
            this.value = JSON.parse(jsonString);
        } catch (error) {
            this.value = {
                user: []
            };
        }
    }

    public isUser(message: Message, users: users[]) {
        return users.some(value => {
            if (value.user_id == message.author.id) return true
        })
    }

    private isFavorite(songs: SongData[], url: string) {
        return songs.some(value => {
            if (value.url == url) return true
        })
    }

    public set(message: Message, song: SongData) {
        if (this.isUser(message, this.value.user)) {
            this.value.user.some(value => {
                if (value.user_id == message.author.id) {
                    if (!this.isFavorite(value.musics, song.url)) {
                        value.musics.push(song)
                    }

                    return true
                }
            })
        }
        else {
            const user: users = {
                user_id: message.author.id,
                musics: []
            }
            user.musics.push(song)

            this.value.user.push(user)
        }
    }

    public save() {
        const json = JSON.stringify(this.value);
        fs.writeFileSync(__dirname + "/data.json", json, 'utf8');
    }
}