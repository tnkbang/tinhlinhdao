import { Message, TextChannel } from "discord.js";

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
            this.value = require("./data.json");
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
        this.get()

        if (this.isUser(message, this.value.USER)) {
            this.value.USER.map(value => {
                if (value.USER_ID == message.author.id) {
                    if (!this.isFavorite(value.MUSICS, url)) {
                        const song: musics = {
                            URL: url
                        }
                        value.MUSICS.push(song)
                    }
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

        var json = JSON.stringify(this.value);
        var fs = require('fs');
        fs.writeFile(__dirname + "/data.json", json, 'utf8', function (err: any) {
            if (err) throw err;
        });
    }
}