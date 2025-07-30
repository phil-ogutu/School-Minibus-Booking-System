// Home page
"use client";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";

export default function Home() {

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
