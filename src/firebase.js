import firebase from 'firebase/app';

const FB_API_KEY = `${process.env.REACT_APP_FB_API_KEY}`;

const config = {
  apiKey: FB_API_KEY,
  authDomain: 'parallel-monument.firebaseapp.com',
  databaseURL: 'https://parallel-monument.firebaseio.com',
  projectId: 'parallel-monument',
  storageBucket: 'parallel-monument.appspot.com',
  messagingSenderId: '915319114232'
};

export default (!firebase.apps.length
  ? firebase.initializeApp(config)
  : firebase.app());
