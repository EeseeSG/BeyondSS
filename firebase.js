import firebase from 'firebase';
require('firebase/firestore');
const firebaseConfig = {
	apiKey: "AIzaSyC7-hJQYGfuL83QZF7CBEzO0dNIlJY8vNI",
	authDomain: "lessonplan-sg.firebaseapp.com",
	projectId: "lessonplan-sg",
	storageBucket: "lessonplan-sg.appspot.com",
	messagingSenderId: "300744757593",
	appId: "1:300744757593:web:52aa8867170bc302de7c48",
	measurementId: "G-DHBWNHTVBY"
};
if (firebase.apps.length === 0) {
	firebase.initializeApp(firebaseConfig)
}

export { firebase, firebaseConfig };