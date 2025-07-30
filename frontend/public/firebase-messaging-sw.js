// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.12.3/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.3/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyA6_6bKAlT0RCYrFY5Y88fhj1DB1YYsE9A",
  authDomain: "skoola-bus.firebaseapp.com",
  projectId: "skoola-bus",
  storageBucket: "skoola-bus.firebasestorage.app",
  messagingSenderId: "239308664910",
  appId: "1:239308664910:web:7f3a1a8135dd95e9f2131f",
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Background message:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/window.svg', // Add your app icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
