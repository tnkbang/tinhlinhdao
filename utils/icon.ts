import { EmojiIdentifierResolvable } from "discord.js"

function generateAniIcon(name: string, id: string) {
    return '<a:' + name + ':' + id + '>'
}

export class Icon {
    static Wait: EmojiIdentifierResolvable = generateAniIcon('wait', '1130414609908645910')
    static Links: EmojiIdentifierResolvable = generateAniIcon('links', '1130414613024997479')
}