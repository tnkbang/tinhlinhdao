export interface Fav {
    USER: users[]
}

interface users {
    USER_ID: string;
    MUSICS: musics[]
}

interface musics {
    TITLE: string,
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

    public set() { }
}