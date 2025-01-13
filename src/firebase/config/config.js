// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB4Ku1HrnqdlOD0d-rqHDrmpBiUmHHUIpk",
  authDomain: "lapor-yuks-c078a.firebaseapp.com",
  projectId: "lapor-yuks-c078a",
  storageBucket: "lapor-yuks-c078a.firebasestorage.app",
  messagingSenderId: "190295088280",
  appId: "1:190295088280:web:abb1bcfb0f7681762304ed",
  measurementId: "G-FV17LCBB6N"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)
export const storage = getStorage(firebaseApp)
