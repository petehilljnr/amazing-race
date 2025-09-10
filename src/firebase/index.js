// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCTOvkii2wiHLAP9e7o35M-8ZG-LhvM8Ts",
  authDomain: "stantec-dpg.firebaseapp.com",
  projectId: "stantec-dpg",
  storageBucket: "stantec-dpg.appspot.com",
  messagingSenderId: "239190953187",
  appId: "1:239190953187:web:cc0ca323cd8974fcf389d6",
  measurementId: "G-1L2E04LJB5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth };