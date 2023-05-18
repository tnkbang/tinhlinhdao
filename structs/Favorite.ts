import { Message, TextChannel } from "discord.js";
const fs = require('fs');

export interface Fav {
    USER: users[]
}

interface users {
    USER_ID: string;
    MUSICS: musics[]
}

interface musics {
    URL: string
}

export class Favorite {
    public value: Fav;
    public get() {
        try {
            const jsonString = fs.readFileSync(__dirname + "/data.json");
            this.value = JSON.parse(jsonString);
        } catch (error) {
            this.value = {
                USER: []
            };
        }
    }

    private isUser(message: Message, users: users[]) {
        return users.some(value => {
            if (value.USER_ID == message.author.id) return true
        })
    }

    private isFavorite(songs: musics[], url: string) {
        return songs.some(value => {
            if (value.URL == url) return true
        })
    }

    public set(message: Message, url: string) {
        if (this.isUser(message, this.value.USER)) {
            this.value.USER.some(value => {
                if (value.USER_ID == message.author.id) {
                    if (!this.isFavorite(value.MUSICS, url)) {
                        const song: musics = {
                            URL: url
                        }
                        value.MUSICS.push(song)
                    }

                    return true
                }
            })
        }
        else {
            const song: musics = {
                URL: url
            }
            const user: users = {
                USER_ID: message.author.id,
                MUSICS: []
            }
            user.MUSICS.push(song)

            this.value.USER.push(user)
        }
    }

    public save() {
        const json = JSON.stringify(this.value);
        fs.writeFileSync(__dirname + "/data.json", json, 'utf8');
    }
}