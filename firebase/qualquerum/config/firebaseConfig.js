// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC9ymcbgcjwBYb_Q_cGhfodZRmvfwtoje0",
  authDomain: "qualquer-um-ed935.firebaseapp.com",
  projectId: "qualquer-um-ed935",
  storageBucket: "qualquer-um-ed935.firebasestorage.app",
  messagingSenderId: "316025489736",
  appId: "1:316025489736:web:f6152112367b38ddab0b7d",
  measurementId: "G-MWWTF2L40K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const autenticacao = getAuth(app);