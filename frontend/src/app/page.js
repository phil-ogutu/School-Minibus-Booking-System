// Home page
"use client";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import { generateToken, messaging } from "@/notifications/firebase";
import { useEffect } from "react";
import { onMessage } from "firebase/messaging";
import { toast } from "react-toastify";

export default function Home() {
  useEffect(() => {
    // Register Service Worker for FCM
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration);
          generateToken();
        })
        .catch((err) => console.error("SW registration failed:", err));
    }

    // Listen for foreground notifications
    if (messaging) {
      onMessage(messaging, (payload) => {
        console.log("Foreground message:", payload);
        const { title, body } = payload.notification || {};
        toast.info(`${title}: ${body}`, {
          position: "top-right",
          autoClose: 4000,
        });
      });
    }
  }, []);

  return (
    <main>
      <Navbar />
      <HeroSection />
    </main>
  );
}
// This is the main entry point for the home page
// It includes the Navbar and HeroSection components, setting up the layout for the home page.
// The "use client" directive indicates that this component should be rendered on the client side.
