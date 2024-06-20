// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWFytYoP1ss38DOl4-9BwLh98sllJSVGU",
  authDomain: "dreamlog-81319.firebaseapp.com",
  projectId: "dreamlog-81319",
  storageBucket: "dreamlog-81319.appspot.com",
  messagingSenderId: "691108567667",
  appId: "1:691108567667:web:497f5b33cc11607b0c6806",
  measurementId: "G-KQYBTYM1YV",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
setPersistence(auth, browserSessionPersistence);
const db = getFirestore(app);
export { auth, db, app };
