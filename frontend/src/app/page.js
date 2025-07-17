// Home page
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
