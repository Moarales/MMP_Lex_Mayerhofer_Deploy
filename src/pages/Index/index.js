import { getData, getClientID, getRedirectUrl, setUserAccessTokken, startPlaying, getRefreshedToken, startPlayingATrack } from '../../modules/api';
import { getArtists, checkIfPlaylistExists, getLongitude, getLatitude, getMyCurrentPlaybackState } from '../../modules/api';
import { getTopTracks, getPlayListById } from '../../modules/api';
import { addTracksToPlaylist, createPrivatePlaylist, getCurrentTrack, getGenres, countContributors, getPlaylistId, stopPlaying, skipToNextSong, skipToPrevSong, getPlaylistTracks } from '../../modules/api';
import template from './index.hbs';
import './index.scss';
import SpotifyWebApi from 'spotify-web-api-node';


export default class IndexPage {
  constructor(root) {
    console.log('Hello from Index Page');
    this.root = root;
    this.data = [];
    this.template = template;
    this.currentTrackTags = [];
    this.currentTrackRelease;
    this.currentTrackPopularity;
    this.playlistContributors = 0;
    this.currentPlayListId = sessionStorage.getItem("currentPlayListId"); //get currentPlayList ID from Session
    this.loadData();
    this.render("loading") //gets a loading animation until the updateSongData rerenders the page
    this.bind();
  }



  async loadData() {

    this.checkIfAccessTokenWasSent();
    this.checkForValidAccessToken();
    console.log("inside Load DAta");
    let topTracks = null;
    if (navigator.geolocation != null && this.currentPlayListId == null && this.checkIfAccessTokenIsSet() == true) {
      {
        topTracks = await getTopTracks();
        console.log("inside line37")
      }

      if (navigator.geolocation != null && this.currentPlayListId == null) { //Check if we got GeoLocation Playlist ID hasnt been already set
        navigator.geolocation.getCurrentPosition(async (position) => {
          sessionStorage.setItem("currentPlaylistName", "Playlist " + + Math.round((position.coords.longitude + Number.EPSILON) * 100) / 100 + " " + Math.round((position.coords.latitude + Number.EPSILON) * 100) / 100);

          if (topTracks != null) {//Check if we got topTracks
            const addTopTraks = await addTracksToPlaylist(position.coords.longitude, position.coords.latitude, topTracks.items); //add Top Tracks to the playlist
          }

          this.currentPlayListId = await getPlaylistId(position.coords.longitude, position.coords.latitude, true); //get filtered playlist


          this.data["currentPlayListId"] = this.currentPlayListId;


          sessionStorage.setItem("currentPlayListId", this.currentPlayListId);//set to currentPlaylistID to Storage

          let playback = {
            context_uri: "spotify:playlist:" + this.currentPlayListId,
          }

          if (this.checkIfAccessTokenIsSet() == true) {
            //startPlayingATrack(playback);
          }

          // console.log("cpID: " + currentPlayListId)
          await this.updateSongData();
        });
      }
    } else {
      await this.updateSongData();
    }
  }

  bind() { //for my javascript events

    const myPlayButton = document.querySelector('#playButton'); //Play Button Config
    const myStopButton = document.querySelector('#stopButton'); //Play Button Config

    const myBackButton = document.querySelector('#backButton');
    const myForwardButton = document.querySelector('#nextButton');

    const html = document.querySelector("html")//custom Style for Index
    html.style.height = "auto";

    // console.log(myPlayButton);

    function togglePlayPause(button1, button2) { //toggle Function for Play and Pause
      button1.classList.toggle("hide");
      button2.classList.toggle("hide");
    }


    if (myPlayButton != null) {
      myPlayButton.addEventListener("click",async () => { //Play Event
        const startPlay= await startPlaying();
        this.updateSongData();
        console.log("Clicked on Play");
        togglePlayPause(myPlayButton, myStopButton);
      })
    }


    if (myStopButton != null) {

      myStopButton.addEventListener("click",async () => { //Stop Event
        const stop = await stopPlaying();
        this.updateSongData()
        console.log("Clicked on stop");

        togglePlayPause(myPlayButton, myStopButton);

      })
    }

    if (myBackButton != null) {
      myBackButton.addEventListener("click", async() => { //Skip Event
        const skip = await skipToPrevSong();
        this.updateSongData();
        console.log("Clicked on Prev");
      })
    }
    if (myForwardButton != null) {

      myForwardButton.addEventListener("click",async () => { //Skip Event
        const skip = await skipToNextSong();
        this.updateSongData();
        console.log("Clicked on Forward");
      })
    }
  }

  render(loading = null) {
    // console.log("Here comes my Data")
    // console.log(this.data)
    this.root.innerHTML = this.template({
      CurrentSong: this.data["nameOfCurrentSong"],
      Artist: this.data["artists"], previousTrackCoverSrc: this.data["previousTrackCoverSrc"],
      nextTrackCoverSrc: this.data["nextTrackCoverSrc"], CurrentSongLength: this.data["duration_ms"], ReleaseDate: this.data["releaseDate"], Popularity: this.data["popularity"],
      Genres: this.data["genres"], PeopleContribution: this.data["playlistContributors"], currentTrackCoverSrc: this.data["coverImgLink"], loading: loading, CurrentSecond : this.data["currentSecond"],
    });
  }


  async updateSongData() {
    // console.log("inside update SongData")
    
    let track = await getMyCurrentPlaybackState(); //gets the currently PLaying Track defaults to first if the song isnt from our playlist
    console.log("currentTrack")
    console.log(track)
    // console.log(track);
    let playList = (await getPlayListById(this.currentPlayListId)).body.tracks.items;
    


    console.log(playList);
    if(track==null){
      this.data["previousTrackCoverSrc"] = playList[49].track.album.images[0].url; //url for cover Img
      this.data["nextTrackCoverSrc"] = playList[1].track.album.images[0].url; //url for cover IMG
      let currentDummySong = playList[0].track

      this.data["nameOfCurrentSong"] = currentDummySong.name;
    this.data["currentSecond"]= "0";

    this.data["nameOfCurrentSong"] = currentDummySong.name;

    // let myDuration = millisToMinutes(currentDummySong.duration_ms);

    this.data["duration_ms"] = currentDummySong.duration_ms;

      // console.log(artists);
 

    this.data["releaseDate"] =  currentDummySong.album.release_date;; //set Release Date

    this.data["popularity"] = currentDummySong.popularity;

    this.data["coverImgLink"] = currentDummySong.album.images[0].url; //get cover Img of current Song


    let DummyPlaylistContributors = await countContributors(this.currentPlayListId);
    this.data["playlistContributors"] = DummyPlaylistContributors;


    let dummyTrackTags = await getGenres(currentDummySong.id);
    // console.log("check");


    dummyTrackTags = dummyTrackTags.map(x => x[0].toUpperCase() + x.slice(1));

    // console.log(currentTrackTags);
    this.data["genres"] = dummyTrackTags;

   
    }else{

      let index = null; //index of current Song in Array

      for (const item of playList) { //get Index of current Song in Playlist Array
        if(item.track.uri == track.item.uri){
          break ;
        }
        index++
      }
      
      let indexOfNextSong = index+1;
      let indexOfPreviousSong = index-1;
      
      if(indexOfPreviousSong<0){ //set PreviousandNext Song
        indexOfPreviousSong = playList.length-1;
      }else if(indexOfNextSong > 49){
        indexOfNextSong = 0;
      }
      
      // console.log("myIndex");
      console.log(index);
      console.log(indexOfNextSong);
      console.log(indexOfPreviousSong);
      this.data["previousTrackCoverSrc"] = playList[indexOfPreviousSong].track.album.images[0].url; //url for cover Img
      this.data["nextTrackCoverSrc"] = playList[indexOfNextSong].track.album.images[0].url; //url for cover IMG
  
  
      
      // console.log("myData:");
      // console.log(track);
  
  
  
      
      let currentMs = track.progress_ms; 
  
      currentMs = millisToMinutes(currentMs);
      this.data["currentSecond"]= currentMs;
  
      console.log(currentMs+"currentState");
  
     // track = await getCurrentTrack(track.context.uri.substring(17,track.context.uri.length)) //only needed for the current playBackState
      track = track.item;
      // getPlaylistTracks(sessionStorage.getItem("currentPlaylistName"));//get Tracks of Playlist
  
      this.data["nameOfCurrentSong"] = track.name;
  
      let trackDuration = millisToMinutes(track.duration_ms);
  
      function millisToMinutes(millis) { //function converts ms to Min:Sec
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
      }
  
      this.data["duration_ms"] = trackDuration;
      console.log(track);
      let artists = ""
      track.artists.forEach(singleArtist => { //combine artists into single string
        artists += singleArtist.name + " ";
      });
  
      // console.log(artists);
      this.data["artists"] = artists;        //get Artists
  
      let currentTrackRelease = track.album.release_date;
      this.data["releaseDate"] = currentTrackRelease; //set Release Date
  
      let currentTrackPopularity = track.popularity; //getPopularity
      this.data["popularity"] = currentTrackRelease;
  
      this.data["coverImgLink"] = track.album.images[0].url; //get cover Img of current Song
  
      let currentTrackTags = await getGenres(track.id);
      // console.log("check");
  
      let playlistContributors = await countContributors(this.currentPlayListId);
      this.data["playlistContributors"] = playlistContributors;
  
  
      console.log("R-Date: " + currentTrackRelease + " PoP:" + currentTrackPopularity + " contributors:" + playlistContributors + " tags:");
      currentTrackTags = currentTrackTags.map(x => x[0].toUpperCase() + x.slice(1));
  
      // console.log(currentTrackTags);
      this.data["genres"] = currentTrackTags;
  
  

    }
  
    this.render(); //rerender after fetches
    this.bind(); //bind after rerender
  }



  checkIfAccessTokenWasSent() {
    //Get the Current Acces Token and set it into Storage
    if (window.location.hash.includes("#access_token=")) {
      let urlParams = window.location.hash;
      let accessTokken = urlParams.split("=")[1];
      accessTokken = accessTokken.split("&")[0];
      console.log(accessTokken + "this is the current AccesToken");

      sessionStorage.setItem("userAccessTokken", accessTokken); //set Token to SessionStorage
      sessionStorage.setItem("Time", new Date())
      setUserAccessTokken(accessTokken);//set UserAPI ACCESS TOKKEN
      history.replaceState(null, "empty", "index"); //removes the token from url
      // window.location.hash = " ";
      // console.log("got acces tokken");
      getRefreshedToken();
      // startPlaying();
    } else if (window.location.search.includes("error=access_denied")) {
      sessionStorage.setItem("Time", new Date())
      alert("We didnt get your permissions you will continue without login")
      sessionStorage.setItem("userAccessTokken", "withoutTokken"); //set token to not authenticated
    }
  }

  checkIfAccessTokenIsSet() {
    if (sessionStorage.getItem("userAccessTokken") == null || sessionStorage.getItem("userAccessTokken") == "withoutTokken") {
      return false;
    } else {
      return true;
    }
  }

  checkForValidAccessToken() {
    if (((new Date) - new Date(sessionStorage.getItem('Time'))) > (60 * 60 * 1000) && sessionStorage.getItem('Time') != null) {   //check if key is still valid if not head to login
      console.log(new Date);
      console.log(sessionStorage.getItem('Time'));
      console.log(60 * 60 * 1000);
      console.log((new Date) - new Date(sessionStorage.getItem('Time')))
      sessionStorage.setItem("Time", new Date());
      console.log(sessionStorage.getItem("Time"))
      document.location = '/login'; // go back to login
    }
  }


};


// const locator= async (topTracks) =>{
//   'use strict';

//   function onPositionRecieved(position){
//       console.log(position);
//       let currentLongitude= position.coords.longitude;
//       let currentLatitude= position.coords.latitude;
//       const currentPlayListId=  addTracksToPlaylist(currentLongitude,currentLatitude,topTracks.items)
//       console.warn(currentPlayListId);
//       return currentPlayListId;


//   }

//   function onPositionChanged(position){
//       console.log(positionError);
//   }

//   if(navigator.geolocation){
//       navigator.geolocation.getCurrentPosition(onPositionRecieved,onPositionChanged);
//   }
//   return currentPlayListId;
// }

