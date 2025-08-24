  // Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCJOdjpTzqHaVWIzTfGGeYXn91R-AQNhaM",
  authDomain: "connectapp-e67ff.firebaseapp.com",
  databaseURL: "https://connectapp-e67ff-default-rtdb.firebaseio.com",
  projectId: "connectapp-e67ff",
  storageBucket: "connectapp-e67ff.firebasestorage.app",
  messagingSenderId: "701150268019",
  appId: "1:701150268019:web:238bc3adab17e0ad397806"
};

export function connectToFirebase() :FirebaseApp {
    const app = initializeApp(FIREBASE_CONFIG);
    return app;
}