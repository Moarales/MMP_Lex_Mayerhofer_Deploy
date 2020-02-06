import template from './search.hbs';
import './search.scss';
import { getPlaylist, getPlaylistTracks } from '../../modules/api';

export default class SearchPage {
  constructor(root) {
    console.log('Hello from Playlist Page');
    this.root = root;
    this.template = template;
    this.data =[];
    this.tracks=[];
    this.playlistLink;
    this.loadData();
  }
  async loadData() {
    
      
      this.tracks = await getPlaylistTracks(sessionStorage.getItem('currentPlaylistName'));
      console.log(this.tracks);
      console.log("before rendering");
    
      
    
    this.render();
    this.bind();
  }

  render() {
    console.log("rendering")
    this.root.innerHTML = this.template({ heading: 'Search', tracks: this.tracks});
  }

  bind() 
  {
    const searchBtn= document.getElementById('searchButton');
    const inputField= document.getElementById('searchInput');
    // inputField.addEventListener('keydown', this.searchSongs());
    searchBtn.addEventListener('click',()=>{ this.searchSongs();});
    
  }

  async searchSongs(){
    this.tracks = await getPlaylistTracks(sessionStorage.getItem('currentPlaylistName'));
    const input= document.getElementById('searchInput').value;
    const lowInput= input.toLowerCase();
    const highInput= input.toUpperCase();
    console.log("clicked");
    console.log(input);
    let nameResults=[];
    let artistResults=[];
    let albumResults=[];
    for(let track of this.tracks ) 
    {
      if(track.track.name.toLowerCase().includes(input.toLowerCase()))
      {
        nameResults.push(track);
      }
      else if(track.track.album.name.toLowerCase().includes(input.toLowerCase()))
      {
        albumResults.push(track);
      }
      else if(track.track.artists[0].name.toLowerCase().includes(input.toLowerCase()))
      {
        artistResults.push(track);
      }
    }
    this.tracks= nameResults.concat(albumResults).concat(artistResults);
    console.log(this.tracks);
    this.render();
    this.bind();
  }
}
