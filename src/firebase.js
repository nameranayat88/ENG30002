// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
 const firebaseConfig = {
  apiKey: "AIzaSyAk9Ixndjx5ZlikPOnDbsk23I_bAyajcHY",
  authDomain: "smart-parking-app-e0a65.firebaseapp.com",
  projectId: "smart-parking-app-e0a65",
  storageBucket: "smart-parking-app-e0a65.appspot.com",
  messagingSenderId: "977302318465",
  appId: "1:977302318465:web:41ace8c3135a04a5e28c80",
  measurementId: "G-WYZL7EPHZL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
