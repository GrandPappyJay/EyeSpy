import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAZR5nx1O3Gw41ZyqMT0W8yxREoqbxF6rQ",
  authDomain: "eyespy-d4644.firebaseapp.com",
  projectId: "eyespy-d4644",
  storageBucket: "eyespy-d4644.firebasestorage.app",
  messagingSenderId: "589716555619",
  appId: "1:589716555619:web:159ef22ba1cb3a4fdf3556"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
