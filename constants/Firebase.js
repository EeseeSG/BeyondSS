import firebase from 'firebase';
require('firebase/firestore');
const firebaseConfig = {
  apiKey: "AIzaSyDO8jwcB_iedH7X7MSm_Bhe_SUvIJOQ_uU",
  authDomain: "bss-sg.firebaseapp.com",
  projectId: "bss-sg",
  storageBucket: "bss-sg.appspot.com",
  messagingSenderId: "736791086604",
  appId: "1:736791086604:web:bfa18351a9a3411ec31029",
  measurementId: "G-671NY6KY7B"
};
if (firebase.apps.length === 0) {
	firebase.initializeApp(firebaseConfig)
}

export { firebase, firebaseConfig };