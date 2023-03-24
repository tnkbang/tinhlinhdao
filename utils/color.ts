import { ColorResolvable } from "discord.js"

let rdColor: ColorResolvable;
const arr = ['99FFFF', '99FF00', '66FFFF', 'FFFF99', 'FF99FF', 'FF6666', 'FF3333', '00EE00', 'FFCC33', '0000FF']

function randomColor() {
    const temp = arr[Math.floor(Math.random() * arr.length)]
    rdColor = `#${temp}`

    return rdColor
}

export { randomColor }