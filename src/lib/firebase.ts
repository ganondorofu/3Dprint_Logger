import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqEenr4S58Bd74rAoNCKbzltn0hI1FXT8",
  authDomain: "print-logger.firebaseapp.com",
  projectId: "print-logger",
  storageBucket: "print-logger.appspot.com",
  messagingSenderId: "17063338212",
  appId: "1:17063338212:web:1d0465cb78bae47abeccf1",
  measurementId: "G-FBJV780710"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
