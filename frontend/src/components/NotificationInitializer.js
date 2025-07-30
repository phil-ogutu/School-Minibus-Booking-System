"use client";

import { useEffect } from "react";
import { messaging, getToken, onMessage } from "@/lib/firebase";
import { useAuthContext } from "@/context/AuthContext";

export default function NotificationInitializer() {
    const { user } = useAuthContext(); // ✅ Get logged-in user

  useEffect(() => {

    if (!messaging || !user?.id) return;

    // Register Service Worker first
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration);
        })
        .catch((err) =>
          console.error("Service Worker registration failed:", err)
        );
    }

    const registerNotifications = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          const token = await getToken(messaging, {
            vapidKey: "BGhK9DdpoIG77Ch7yq8nby7f5o94mmf31JWqAcAySrqSvyuUE5OHrJ2hGQIz6Oe39r_qDDfZqyVVj3-9lsePITs",
          });

          if (token) {
            console.log("FCM Token:", token);

            await fetch("http://localhost:5000/api/save-fcm-token", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token, user_id: user.id }),
            });
          }
        }
      } catch (err) {
        console.error("Error getting FCM token:", err);
      }
    };

    registerNotifications();

    // Handle foreground messages
    onMessage(messaging, (payload) => {
      console.log("Message received:", payload);
      alert(payload.notification.title);
    });
  }, [user]);

  return null;
}
