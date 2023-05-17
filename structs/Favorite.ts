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
            this.value = require("../commands/data.json");
        } catch (error) {
            this.value = {
                USER: []
            };
        }
    }

    private isUser(message: Message, users: users[]) {
        users.map(value => {
            if (value.USER_ID == message.author.id) return true
        })
        return false
    }

    public set(message: Message, url: string) {
        this.get()

        if (this.isUser(message, this.value.USER)) {
            this.value.USER.map(value => {
                if (value.USER_ID == message.author.id) {
                    const song: musics = {
                        URL: url
                    }
                    value.MUSICS.push(song)
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
        fs.writeFile("../commands/data.json", json, 'utf8', function (err: any) {
            if (err) throw err;
            return (message.channel as TextChannel)
                .send({ content: "Đã thêm bài hát vào yêu thích !" })
                .catch(console.error);
        });
    }
}