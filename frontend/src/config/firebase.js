import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCduXk_YS5uj07RHsIgNwDr1xh59ZnM9ZM",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "eduvault-6013a.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "eduvault-6013a",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "eduvault-6013a.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "463242947728",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:463242947728:web:093a241da6e4c48edabc15",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-34EPH93PCK",
};

// Initialize Firebase once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export { app, auth, googleProvider };
