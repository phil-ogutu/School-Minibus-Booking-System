// Import the functions you need from the SDKs you need
"use client";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

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

let messaging = null;
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  messaging = getMessaging(app);
}

export const generateToken = async () => {
    const permission = await Notification.requestPermission();
    console.log(permission)

    if(permission === "granted"){
        const token = await getToken(messaging, {
        vapidKey: "BGhK9DdpoIG77Ch7yq8nby7f5o94mmf31JWqAcAySrqSvyuUE5OHrJ2hGQIz6Oe39r_qDDfZqyVVj3-9lsePITs"
    });

    console.log(token);
    }  
}

export { messaging }
