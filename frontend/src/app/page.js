// Home page
"use client";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Booking from "./bookings/page";

export default function Home() {
  return (
    <main>
      <Navbar />
      {/* <HeroSection /> */}
      {/* <Login /> */}
      <Booking />
    </main>
  );
}
// This is the main entry point for the home page
// It includes the Navbar and HeroSection components, setting up the layout for the home page.
// The "use client" directive indicates that this component should be rendered on the client side.
