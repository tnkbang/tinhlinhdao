import { Message } from "discord.js";

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

    public set(message: Message, url: string) { }
}