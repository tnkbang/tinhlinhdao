import youtube, { Playlist as YoutubePlaylist } from "youtube-sr";
import { config } from "../utils/config";
import { Song } from "./Song";
import { isURL, playlistPattern } from "../utils/patterns";
import { i18n } from "../utils/i18n";

export class Playlist {
  public data: YoutubePlaylist;
  public videos: Song[];

  public constructor(playlist: YoutubePlaylist) {
    this.data = playlist;

    this.videos = this.data.videos
      .filter((video) => video.title != "Private video" && video.title != "Deleted video")
      .slice(0, config.MAX_PLAYLIST_SIZE - 1)
      .map((video) => {
        return new Song({
          title: video.title!,
          url: `https://youtube.com/watch?v=${video.id}`,
          duration: video.duration / 1000
        });
      });
  }

  public static async from(url: string = "", search: string = "") {
    var reg = new RegExp("[?]v=([a-z0-9_]+)", "i");
    var match = reg.exec(url);

    if (match) search = match[1]

    const urlValid = playlistPattern.test(search);
    let playlist = new YoutubePlaylist()

    if (urlValid) playlist = await youtube.getPlaylist(search);
    else playlist = await this.getVideoMix(url, search)

    return new this(playlist);
  }

  //get video when search query not find playlist
  private static async getVideoMix(url: string, search: string) {
    //has playlist when search
    const pls = await youtube.searchOne(search, "playlist");
    if (pls) return await youtube.getPlaylist(pls.url!);

    //can't find playlist when search
    let playlist = new YoutubePlaylist()
    playlist.title = i18n.__("playlist.titleMixed");
    playlist.url = `https://www.youtube.com/results?search_query=${search.replace(' ', '+')}`;

    //search query is mix playlist url
    if (isURL.test(url)) search = (await youtube.searchOne(search, 'video')).title!;

    const videos = await youtube.search(search, { type: 'video', limit: 5 })
    if (videos) playlist.videos.push(...videos)

    return playlist
  }
}