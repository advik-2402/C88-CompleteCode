import firebase from 'firebase';
require('@firebase/firestore')

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDSKMWNjPHsRH99DLcKqYJ-T230B0gnGEU",
  authDomain: "book-santa-ecbb3.firebaseapp.com",
  databaseURL: "https://book-santa-ecbb3.firebaseio.com",
  projectId: "book-santa-ecbb3",
  storageBucket: "book-santa-ecbb3.appspot.com",
  messagingSenderId: "458503963683",
  appId: "1:458503963683:web:0f462f43869b15a33e5d96"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
