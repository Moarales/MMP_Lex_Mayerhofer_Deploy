import Navigo from 'navigo';

import IndexPage from '../pages/Index';
import NotFoundPage from '../pages/NotFound';
import LoginPage from '../pages/Login';
import PlaylistPage from '../pages/Playlist';
import SearchPage from '../pages/Search';




const navigoRoot = window.location.origin;
const router = new Navigo(navigoRoot);
const root = document.querySelector('#app');


router.notFound(() => {
  const notFound = new LoginPage(root);
  notFound.render();
});

router
  .on(
    {
      'index': function () {
        const index = new IndexPage(root);
        // index.render();       //preRender
        // index.bind();
      },
      'not-there': function () {
        const notFound = new NotFoundPage(root);
        notFound.render();
      },
      'login': function () {
        const login = new LoginPage(root);
        login.render();
      },
      'playlist': function () {
        const playlist = new PlaylistPage(root);
        playlist.render();
      },
      'search': function () {
        const search = new SearchPage(root);
      },
      '/': function () {
        const login = new LoginPage(root);
        login.render();
      }
    },
  );


export default router;
