import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';

const config = {
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
};

// TODO: Authentication
const provider = new firebase.auth.GoogleAuthProvider();
firebase.initializeApp(config);

export const userLogin = async () =>
  // google login
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((response) => response)
    .catch((error) => error);


export const userLogout = async () => firebase
  .auth()
  .signOut()
  .then((response) => response)
  .catch((error) => error);
