// Import the functions you need from the SDKs you need
"use client";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA6_6bKAlT0RCYrFY5Y88fhj1DB1YYsE9A",
  authDomain: "skoola-bus.firebaseapp.com",
  projectId: "skoola-bus",
  storageBucket: "skoola-bus.firebasestorage.app",
  messagingSenderId: "239308664910",
  appId: "1:239308664910:web:7f3a1a8135dd95e9f2131f",
  measurementId: "G-F4V0WM3L3N",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const messaging = typeof window !== "undefined" ? getMessaging(app) : null;

export { messaging, getToken, onMessage };
