const mainUrl = 'https://opentdb.com/api.php?';

export const getData = ({ amount = 10, difficulty = 'easy' }) => {
  const url = `${mainUrl}amount=${amount}&difficulty=${difficulty}&type=multiple`;

  return fetch(url)
    .then((response) => response.json())
    .then((myJson) => myJson.results);
};



export default getData;

var SpotifyWebApi = require('spotify-web-api-node');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId: 'f4c519aa648d49aaa963ca6a6b439f07',
  clientSecret: '94305db1f22040c0b1c7a1be23c73a27',
  redirectUri: 'http://localhost:8080',
});

spotifyApi.setRefreshToken("AQDAsLHmdFuhA-5oGqlMZU7gqzGECdRAD4XUrDU_1Y4P_l8SvxmfrJNzlqM4pmL-2LoeAPwgjNBj5SeJwBH9KRHsX2rkBJaykA9n4Ph5IErcES2F68U8IbjCXDWVuqIMrig"); //localLy Refresh Tokken
if (sessionStorage.getItem("locallyAccesSToken") != undefined) {  //set Token if you have stored in session
  spotifyApi.setAccessToken(sessionStorage.getItem("locallyAccesSToken"));
}

// spotifyApi.setAccessToken('BQBdrj7BwZSiGLz5bZZGpWp-1AHAJmgoweSHRcn2sA5JrxmcAGuhyK-CeIl9S3kuPTojPyHRfZAnux2O7zA3xaT1MPdKSDliO37N0Vz6mHRU8qmbvVl8W2W5fRDCTRlsj69CELE5zJy4vBp0BASMjB0jhUNLV5_Z5MQMrJRyQNB3F5OXVF0t06uqMY60nGXCZvNDqzAz_CE71rtzjxrta1sHNYdeHnx-AIZbTJjdLBfeEM7LKwb65GoH6lFUghU');


export let getArtists = () => {
  return spotifyApi.searchArtists('Elemental')
    .then(function (data) {
      console.log('Search artists by "Elemental"', data.body.artists.items);
      return data.body.artists.items

    }, function (err) {
      console.error(err);
    });
}



var userSpotifyApi = new SpotifyWebApi({ //for your calls to UsersTracks
  clientId: 'f4c519aa648d49aaa963ca6a6b439f07',
  // clientSecret: '94305db1f22040c0b1c7a1be23c73a27',//not needed for user API Calls
  redirectUri: 'http://localhost:8080/index',
})


export const getClientID = userSpotifyApi._credentials.clientId; //getter for Client ID of userSpotify
export const getRedirectUrl = userSpotifyApi._credentials.redirectUri; //getter for Redirect URL of userSpotify

if (sessionStorage.getItem("userAccessTokken") != undefined) { //set Token if you have stored in session
  userSpotifyApi.setAccessToken(sessionStorage.getItem("userAccessTokken"));
}

export function setUserAccessTokken(accessTokken) {
  userSpotifyApi.setAccessToken(accessTokken)

  console.log("I set the Acces Tokken to:" + accessTokken);
  console.log(userSpotifyApi);
  console.log(spotifyApi);
}


export let getTopTracks = () => {
  // console.log(userSpotifyApi);
  return userSpotifyApi.getMyTopTracks({
    limit: 50
  })
    .then(function (data) {
      console.log('Top Tracks', data.body);
      return data.body;

    }, function (err) {
      console.error('Keine Top Tracks ', err);
    });
}

export let stopPlaying = () => {//stops playing
  return userSpotifyApi.pause()
    .then(function (data) {
      console.log('stoped Playing', data.body);
      console.log(data.body);
      return data.body;
    }, function (err) {
      console.error('cant stop playing', err);
    });
}

export let startPlaying = () => {//starts playing
  return userSpotifyApi.play() //TODO ADD the device ID
    .then(function (data) {
      console.log('Started playing', data.body);
      // console.log(data.body);
      return data.body;
    }, function (err) {
      console.error('cant start playing', err);
    });
}


export let startPlayingATrack = (track) => {//starts playing
  return userSpotifyApi.play(track) //TODO ADD the device ID
    .then(function (data) {
      console.log('Started playing', data.body);
      // console.log(data.body);
      return data.body;
    }, function (err) {
      console.log(userSpotifyApi);
      console.error('cant start playing', err);
    });
}

export let skipToNextSong = () => {//Skips to next Song
  return userSpotifyApi.skipToNext()
    .then(function (data) {
      console.log('Skipped to next Song', data.body);
      // console.log(data.body);
      return data.body;
    }, function (err) {
      console.error('Couldnt Skip', err);
    });
}


export let skipToPrevSong = () => {//skips to prev Song
  return userSpotifyApi.skipToPrevious()
    .then(function (data) {
      console.log('Skipped to Prev Song', data.body);
      // console.log(data.body);
      return data.body;
    }, function (err) {
      console.error("Couldn't skip to Prev Song", err);
    });
}
export let getUser = () => { //gets user details...
  return userSpotifyApi.getMe()
    .then(function (data) {
      console.log('User', data.body);
      console.log('User is', data.body.product)
      // console.log(data.body);
      return data.body;
    }, function (err) {
      console.error("Couldnt get user Data", err);
    });
}
console.log("User ClientId")
console.log(userSpotifyApi.getClientId());

export let getMyCurrentPlaybackState = () => { //gets user details...
  return userSpotifyApi.getMyCurrentPlaybackState()
    .then(function (data) {
      console.log('playbackState', data);
      // console.log(data.body);
      return data.body;
    }, function (err) {
      console.error("Couldnt get user Data", err);
    });
}


export const createPrivatePlaylist = (name, songTrackArray) => {
  const songArray = [];
  return spotifyApi.createPlaylist('hxeh7byn1cu61zbosqcfh9ytu', name, { 'public': false })
    .then(function (data) {
      console.log('Created playlist!' + name);
      console.warn(data.body.name);
      return data.body.id;

    }, function (err) {
      console.log('Couldnt Create Private Playlist!', err);
    })
    .then(songTrackArray.forEach(track => songArray.push(track.uri)))
    .then((id) => {
      spotifyApi.addTracksToPlaylist(id, songArray);
    })
}

export const createPublicPlaylist = (name, songTrackArray) => {
  const songArray = [];
  return spotifyApi.createPlaylist('hxeh7byn1cu61zbosqcfh9ytu', name, { 'public': true })
    .then(function (data) {
      console.log('Created public playlist!' + name);
      return data.body.id;

    }, function (err) {
      console.log('Couldnt create Public Playlist!', err);
    })
    .then(songTrackArray.forEach(track => songArray.push(track.uri)))
    .then((id) => {
      spotifyApi.addTracksToPlaylist(id, songArray);
    })
}

export const addTracksToPlaylist = (long, lat, songTrackArray) => {
  const name = "Hidden Playlist " + Math.round((long + Number.EPSILON) * 100) / 100 + " " + Math.round((lat + Number.EPSILON) * 100) / 100;
  const pname = name.substring(7, name.length);
  let songArray = [];
  spotifyApi.getUserPlaylists('hxeh7byn1cu61zbosqcfh9ytu')//User Id of your Playlist
    .then(async function (data) {
      for (let i = 0; i < data.body.items.length; i++) {
        if (data.body.items[i].name === name) {
          return data.body.items[i].id;
        }
      }

      const publicPlaylistId = await createPublicPlaylist(pname, songTrackArray);
      const privatePlaylistId = await createPrivatePlaylist(name, songTrackArray);


      return privatePlaylistId;

    }, function (err) {
      console.log('Something went wrong!', err);
    })

    .then(songTrackArray.forEach(track => songArray.push(track.uri)))

    .then(async (id) => {
      console.log("Id: " + id);
      console.log(songArray)
      const addTracks = await spotifyApi.addTracksToPlaylist(id, songArray);
      console.log('Added tracks to playlist! ' + id);
      const data = await spotifyApi.getPlaylist(id);
      console.log("track number:" + data.body.tracks.total)
      if (data.body.tracks.total >= 100) {
        const updete = await updateTruePlaylist(name);
      }
      return id;
    });
}

export function getRefreshedToken() {
  fetch('https://accounts.spotify.com/api/token', {
    method: "POST",
    body: "grant_type=refresh_token&refresh_token=AQDAsLHmdFuhA-5oGqlMZU7gqzGECdRAD4XUrDU_1Y4P_l8SvxmfrJNzlqM4pmL-2LoeAPwgjNBj5SeJwBH9KRHsX2rkBJaykA9n4Ph5IErcES2F68U8IbjCXDWVuqIMrig",
    headers: {
      Authorization: "Basic ZjRjNTE5YWE2NDhkNDlhYWE5NjNjYTZhNmI0MzlmMDc6OTQzMDVkYjFmMjIwNDBjMGIxYzdhMWJlMjNjNzNhMjc=",
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  }).then(function (response) {
    // console.log("here comes the response")
    // console.log(response);
    return response.json();
  }).then(function (json) {
    // console.log("now in json")
    console.log(json);
    // console.log(json.access_token);
    spotifyApi.setAccessToken(json.access_token);//sets acces token for our api
    sessionStorage.setItem("locallyAccesSToken", json.access_token); //set Token to SessionStorage
    return json;
  }).catch(e => console.log("Error:", e));
};

export const checkIfPlaylistExists = (long, lat) => {
  const hname = "Hidden Playlist " + long + " " + lat;
  spotifyApi.getUserPlaylists('hxeh7byn1cu61zbosqcfh9ytu')
    .then(function (data) {
      console.log('Retrieved playlists', data.body);
      for (let i = 0; i < data.body.items.length; i++) {
        if (data.body.items[i].name === hname) {
          console.log("Found playlist: " + data.body.items[i].name + " ID: " + data.body.items[i].id);
          spotifyApi.addTracksToPlaylist(data.body.items[i].id, songArray)
            .then(function (data) {
              console.log('Added tracks to playlist!' + data.body);
              return data.body;
            }, function (err) {
              console.log('Something went wrong!', err);
            });
        }
        createPrivatePlaylist(hname);
      }
      return null;
    }, function (err) {
      console.log('Something went wrong!', err);
    })
}

const getPlaylistTracksIds = (playlistId) => {
  let idArray = [];
  console.log(playlistId);
  return spotifyApi.getPlaylist(playlistId)
    .then(function (data) {
      data.body.tracks.forEach(item => { idArray.push(item.track.id) });
      console.log(idArray);
      return idArray;
    }, function (err) {
      console.log("Couldnt get Playlist Track ID: " + err);
    });
}

export const getCurrentTrack = async (playlistId) => {
  let data = await userSpotifyApi.getMyCurrentPlayingTrack();
  if (data.body != null) {
    console.log("Currently Playing Track: " + playlistId);
    const playlistTracks = await getPlaylistTracksIds(playlistId);
    console.warn(playlistTracks);
    console.log(data.body.item.id)
    
      let data2 = await spotifyApi.getPlaylist(playlistId);
      console.log("Song is not in Playlist defaulted to:" + data2.body.tracks.items[0].track.name);
      return data.body.tracks.items[0].track;
  }
  else {
    let data = await spotifyApi.getPlaylist(playlistId)
    console.log("No song is playing defaulted to:" + data.body.tracks.items[0].track.name);
    console.log(data.body.tracks.items[0]);
    return data.body.tracks.items[0].track;
  }
}



//TODO: ARRAY instead of callback
export const getTrackByPosition = async (playlistId, currentTrackId) => {
  let position = 0;
  let data = await spotifyApi.getPlaylist(playlistId);
  for (let item of data.body.tracks) {
    if (item.track.id === currentTrackId) {
      break;
    }
    position++;
  }
  return data.body.tracks[position];
  console.log("Currently Playing Track: " + data.body.item.name);
  const playlistTracks = await getPlaylistTracksIds(playlistId);
  return playlistTracks[position + 1];
}



export const getGenres = async (songId) => {
  console.log("Song ID " + songId);
  let data = await spotifyApi.getTracks([songId]);
  let artist = await spotifyApi.getArtists([data.body.tracks[0].artists[0].id]);
  return artist.body.artists[0].genres;
  return [];
}

export const countContributors = async (playlistId) => {
  let data = await spotifyApi.getPlaylist(playlistId)
  return Math.round(data.body.tracks.total / 50);
}

export const getPlaylistId = async (long, lat, isFiltered) => {
  let name = "leer";
  if (isFiltered == true) {
    name = "Playlist " + Math.round((long + Number.EPSILON) * 100) / 100 + " " + Math.round((lat + Number.EPSILON) * 100) / 100;
  }
  else {
    name = "Hidden Playlist " + Math.round((long + Number.EPSILON) * 100) / 100 + " " + Math.round((lat + Number.EPSILON) * 100) / 100;
  }

  let data = await spotifyApi.getUserPlaylists('hxeh7byn1cu61zbosqcfh9ytu')
  for (let i = 0; i < data.body.items.length; i++) {
    if (data.body.items[i].name === name) {
      return data.body.items[i].id;
    }
  }
  return data.body.items[0].id;

}

// Diese Funktion wird die öffentliche Playlist für einen Standort erstellen, ihren Ihalt überprüfen und sie updaten
const updateTruePlaylist = async (hname) => {
  const name = hname.substring(7, hname.length);
  console.warn(name);

  const data = await spotifyApi.getUserPlaylists('hxeh7byn1cu61zbosqcfh9ytu');
  let truePlaylist = [];
  let truePlaylistId;

  for (let i = 0; i < data.body.items.length; i++) {
    let item = data.body.items[i];
    console.log(item);
    if (item.name === hname) {
      const deleteArray = [];
      let position = 0;
      let updateMap = new Map();
      let amount;
      const tracks = await spotifyApi.getPlaylistTracks(item.id);
      console.log(tracks.body.items);
      for (let track of tracks.body.items) {
        if (updateMap.has(track.track.uri)) {
          amount = updateMap.get(track.track.uri);
          amount++;
          updateMap.set(track.track.uri, amount);
        }
        else {
          updateMap.set(track.track.uri, 1);
          //deleteArray.push(track.track.uri);
        }
        deleteArray.push(position);
        position++;
      }
      console.log(updateMap);
      const obj = await Object.fromEntries(updateMap);
      const sortedSongs = sortProperties(obj);
      console.log("sortedSongs");
      console.warn(sortedSongs);
      //Array with the 50 most heared songIds
      for (let i = 0; i < 50; i++) {
        truePlaylist.push(sortedSongs[i][0]);

      }
      for (let i = 0; i < 100; i++) {
        deleteArray.push(i);
      }
      //const data = await spotifyApi.getPlaylist(item.id);
      //  while(data.body.tracks.total>0)
      // {
      const deleteAll = await spotifyApi.removeTracksFromPlaylistByPosition(item.id, deleteArray, item.snapshot_id);
      //   data = await spotifyApi.getPlaylist(item.id);
      //   console.log("delete loop")
      // }

      console.log("deleted hidden");
      const item2 = data.body.items[i + 1]
      if (item2.name === name) {
        console.log("hEre")

        const deleteArray = [];
        for (let i = 0; i < 50; i++) {
          deleteArray.push(i);
        }
        const deleteAll = await spotifyApi.removeTracksFromPlaylistByPosition(item2.id, deleteArray, item2.snapshot_id);

        console.log("deleted main");
        truePlaylistId = item2.id;
        console.warn(truePlaylist);
        console.warn(truePlaylistId);
        const addAll = await spotifyApi.addTracksToPlaylist(truePlaylistId, truePlaylist);
        break;
      }


    }

  }


}

function sortProperties(obj) {
  // convert object into array
  var sortable = [];
  for (var key in obj)
    if (obj.hasOwnProperty(key))
      sortable.push([key, obj[key]]); // each item is an array in format [key, value]

  // sort items by value
  sortable.sort(function (a, b) {
    return b[1] - a[1]; // compare numbers
  });
  return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
}

export const getPlaylist = async (name) => {
  const data = await spotifyApi.getUserPlaylists('hxeh7byn1cu61zbosqcfh9ytu');
  for (let playlist of data.body.items) {
    if (name === playlist.name) {
      return playlist;
    }
  }
}

export const getPlaylistTracks = async (name) => {
  const data = await spotifyApi.getUserPlaylists('hxeh7byn1cu61zbosqcfh9ytu');
  for (let playlist of data.body.items) {
    if (name === playlist.name) {
      const tracks = await spotifyApi.getPlaylistTracks(playlist.id);
      console.log("woooho")
      console.log(tracks.body.items)
      return tracks.body.items;
    }
  }
}

export const getPlayListById= async(playListId)=>{
  // console.log("myplayID"+ playListId)
  const data = await spotifyApi.getPlaylist(playListId)
  // console.log("myPlaylist");
  // console.log(data);
  return data;
}


