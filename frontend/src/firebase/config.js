// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);