import firebase from 'firebase/app'
import 'firebase/auth'
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBVbcCNIlO2QQkJTUPujt_vDzVuYGEb2p8',
  authDomain: 'myprojects-b35f4.firebaseapp.com',
  projectId: 'myprojects-b35f4',
  storageBucket: 'myprojects-b35f4.appspot.com',
  messagingSenderId: '385160758950',
  appId: '1:385160758950:web:8f8352fa61c21f81e09667',
}
// Initialize Firebase

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

//export
export const auth = firebase.auth()
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider()
