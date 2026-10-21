import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD_IG8aHbVwu0-Whcys4Mh246C9IDf2iMc",
  authDomain: "data-science-and-biochemistry.firebaseapp.com",
  projectId: "data-science-and-biochemistry",
  storageBucket: "data-science-and-biochemistry.firebasestorage.app",
  messagingSenderId: "172401784767",
  appId: "1:172401784767:web:0385dbaae250c0f177930a",
  measurementId: "G-TZ6T4230ZR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
