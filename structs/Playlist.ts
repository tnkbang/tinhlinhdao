import youtube, { Playlist as YoutubePlaylist } from "youtube-sr";
import { config } from "../utils/config";
import { Song } from "./Song";
import { playlistPattern } from "../utils/patterns";
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

    if (urlValid) {
      playlist = await youtube.getPlaylist(search);
    } else {
      const pls = await youtube.searchOne(search, "playlist");
      if (pls) playlist = await youtube.getPlaylist(pls.url!);
      else {
        //can't find playlist then get from id video
        playlist.title = i18n.__("playlist.titleMixed");
        playlist.url = url;

        //get video from mix playlist
        const video = await youtube.searchOne(search, 'video');
        if (video) playlist.videos.push(await youtube.getVideo(video.url))
      }
    }

    return new this(playlist);
  }
}
