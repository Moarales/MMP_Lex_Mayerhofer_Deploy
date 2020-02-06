import './scss/app.scss';
import router from './modules/router';
import { createPlaylist, startPlaying, getTopTracks } from './modules/api';

router.resolve();

// Let router take over navigation of links
[...document.querySelectorAll('a')].map((el) => {
  el.addEventListener('click', (e) => {
    const href = e.currentTarget.getAttribute('href');
    if (!href.startsWith('http') && !href.startsWith('www')) {
      e.preventDefault();
      router.navigate(href.substr(1));
    }
  });
});

// Remove Haeder on Login
const url = window.location.pathname;
const filename = url.substring(url.lastIndexOf('/') + 1);
console.log(filename);
if (filename == 'login') {
  //removed just in Case MergeConflict
} else if (filename == 'index') {
//removed just in Case MergeConflict
}
else if (filename == 'playlist') {
  //const reversedTriangle= document.getElementById('trinagle').classList.add('reversed');
}


class PlayBack {
  constructor(songTime, currentWidth, track) {
    this.songLength = songTime;
    this.currentWidth = currentWidth;
    this.play = false;
    this.track = track;
  }
  // update() { //updates the progressBar in our Player //looks a little bit slow
  //   var element = document.getElementById("myprogressBar");
  //   var identity = setInterval(scene, 10);
  //   function scene() {
  //     if (this.currentWidth >= 100) {
  //       //TODO: add play next song
  //       clearInterval(identity);
  //     }
  //     else {
  //       this.currentWidth += this.songlength / (100 * this.songlength);
  //       element.style.width = this.currentWidth + '%';
  //     }
  //   }
  // }

  getCurrentWidth() {
    return this.currentWidth;
  }

  setCurrentWidth(width) {
    this.currentWidth = width;
  }

  stopPlayer() {
    this.play = false;
  }

  resumePlayer() {
    this.play = true;
  }
}




// let currentSong = new PlayBack(1000, 0);
// currentSong.setCurrentWidth(10);
// currentSong.resumePlayer();
// console.log(currentSong.getCurrentWidth());
// console.log(currentSong);

// currentSong.update();


class Song {
  constructor(track = null) {
    this.artists = track.arists;
    this.duration = track.duration_ms;
    this.name = track.name;
  }
}




// function update(songlength = 104600) { //updates the progressBar in our Player //looks a little bit slow
//   var element = document.getElementById("myprogressBar");
//   var width = 1;
//   var identity = setInterval(scene, 10);
//   function scene() {
//     if (width >= 100) {
//       //TODO: add play next song
//       clearInterval(identity);
//     } else {
//       width += songlength / (100 * songlength);
//       element.style.width = width + '%';
//     }
//   }
// }

// update();


