import firebase from "firebase/app";
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyA0hpd7MlJzNu-T5TkHfOHFA6dKi3Z8j1A",
  authDomain: "marvel-b4754.firebaseapp.com",
  projectId: "marvel-b4754",
  storageBucket: "marvel-b4754.appspot.com",
  messagingSenderId: "594834688356",
  appId: "1:594834688356:web:9c072f5f9df151ffc79271"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export {firebase}