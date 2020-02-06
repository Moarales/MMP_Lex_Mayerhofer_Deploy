import template from './playlist.hbs';
import './playlist.scss';
import { getPlaylist, getPlaylistTracks } from '../../modules/api';

export default class PlaylistPage {
  constructor(root) {
    console.log('Hello from Playlist Page');
    this.root = root;
    this.template = template;
    this.data =[];
    this.tracks=[];
    this.playlistLink;
    this.loadData();
    this.render();
  }
  async loadData() {
    
      console.log("current Playlist:" + sessionStorage.getItem('currentPlaylistName'));
      const playlist= await getPlaylist(sessionStorage.getItem('currentPlaylistName'));
      this.playlistLink = "https://open.spotify.com/playlist/"+playlist.id;
      this.tracks = await getPlaylistTracks(sessionStorage.getItem('currentPlaylistName'));
      console.log(this.tracks);
      console.log("before rendering");
    
    
    this.render();
  }

  render() {
    console.log("rendering")
    this.root.innerHTML = this.template({ heading: sessionStorage.getItem('currentPlaylistName'), playlistLink: this.playlistLink, tracks: this.tracks});
  }
}
