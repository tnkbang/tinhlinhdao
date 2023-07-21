# tinhlinhdao

Discord Bot built with discord.js for <a href="https://discord.gg/rgQG6jt">Luan Hoi - Tuyet Tinh Dao</a> server.
</br>
Music playback function referenced by <a href="https://github.com/eritislami/evobot">evobot</a>.
<br/>
Reaction emoij referenced <a href="https://www.flaticon.com/authors/kp-arts/flat-gradient">KP Arts Flat Gradient</a>.
</br>
Sleep command referenced by J2Team bot.

## Requirements

1. Discord Bot Token **[Guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)**  
   1.1. Enable 'Message Content Intent' in Discord Developer Portal
2. Node.js 16.11.0 or newer

## Getting Started

```sh
git clone https://github.com/tnkbang/tinhlinhdao.git
cd tinhlinhdao
npm install
```

After installation finishes follow configuration instructions then run `npm run start` to start the bot.

## Configuration

Copy or Rename `config.json.txt` to `config.json` and fill out the values:

Change your `TOKEN`, owner id for `OWNER` and other values....

⚠️ **Note: Never commit or share your token or api keys publicly** ⚠️

```json
{
  "TOKEN": "",
  "MAX_PLAYLIST_SIZE": 10,
  "OWNER": "",
  "PREFIX": "::",
  "PRUNING": false,
  "LOCALE": "vi",
  "UTC": 7,
  "STAY_TIME": 30,
  "DEFAULT_VOLUME": 100
}
```

## Features & Commands

After the bot working, using `/help` or `::help` to view all command of bot.

- Music playing: play, search, favorite, queue, nowplaying, skip, stop,...
- When playing music, you can use the `favorite` feature to save a playlist of your favorite songs for quick playback.
- Using `sleep` to calculate sleep time.
- And waiting for development :>>