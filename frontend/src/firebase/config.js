
import { initializeApp } from "firebase/app";
import{getAuth, GoogleAuthProvider} from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBTdIkflPQwuH71c4TRXfrekBS_9rbnWVA",
  authDomain: "notetaking-5dec2.firebaseapp.com",
  projectId: "notetaking-5dec2",
  storageBucket: "notetaking-5dec2.firebasestorage.app",
  messagingSenderId: "256883135960",
  appId: "1:256883135960:web:5ac7f7af2bf42be2920ead",
  measurementId: "G-H50BHTRF2N"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
console.log(auth);
export const googleProvider = new GoogleAuthProvider();