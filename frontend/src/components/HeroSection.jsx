"use client";
import Image from "next/image";
import Button from "./Button";
import Footer from "./Footer";
import {
  FaMapPin,
  FaMobileAlt,
  FaShieldAlt,
  FaUsers,
  FaClock,
  FaHeadphones,
} from "react-icons/fa";

const HeroSection = () => (
  <>
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <Image
        src="/bus-hero.png"
        alt="School Bus with children"
        fill
        priority
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50 z-0"></div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center text-white">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
          Affordable, Reliable School Transport for Every Family.
        </h1>
        <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10">
          All in one platform built for your family’s peace of mind.
        </p>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {/* Safe Rides */}
          <div className="glass-card">
            <FaShieldAlt className="w-10 h-10 text-blue-500 mb-3 mx-auto" />
            <h3 className="font-bold text-xl mb-2">Safe Rides</h3>
            <p className="text-sm text-gray-200">
              Background-checked drivers & GPS-monitored buses for maximum
              safety.
            </p>
          </div>

          {/* Real-Time Tracking */}
          <div className="glass-card">
            <FaMapPin className="w-10 h-10 text-green-500 mb-3 mx-auto" />
            <h3 className="font-bold text-xl mb-2">Real-Time Tracking</h3>
            <p className="text-sm text-gray-200">
              Track your child's exact bus location & arrival times on your
              phone.
            </p>
          </div>

          {/* Easy Booking */}
          <div className="glass-card">
            <FaMobileAlt className="w-10 h-10 text-purple-500 mb-3 mx-auto" />
            <h3 className="font-bold text-xl mb-2">Easy Booking</h3>
            <p className="text-sm text-gray-200">
              Simple mobile app to book, modify, and manage rides in seconds.
            </p>
          </div>
        </div>

        {/* CTA */}
        <Button href="/bookings" variant="primary" size="lg">
          Book your ride
        </Button>
      </div>
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-white/70"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>

    {/* Statistics section */}
    <section className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div>
          <FaUsers className="w-10 h-10 text-blue-600 mx-auto mb-2" />
          <div className="text-3xl font-bold text-blue-600">10K+</div>
          <p className="text-gray-600">Happy Families</p>
        </div>
        <div>
          <FaClock className="w-10 h-10 text-green-600 mx-auto mb-2" />
          <div className="text-3xl font-bold text-green-600">99.9%</div>
          <p className="text-gray-600">On-Time Arrival</p>
        </div>
        <div>
          <FaUsers className="w-10 h-10 text-purple-600 mx-auto mb-2" />
          <div className="text-3xl font-bold text-purple-600">500+</div>
          <p className="text-gray-600">Qualified Drivers</p>
        </div>
        <div>
          <FaHeadphones className="w-10 h-10 text-orange-600 mx-auto mb-2" />
          <div className="text-3xl font-bold text-orange-600">24/7</div>
          <p className="text-gray-600">Support</p>
        </div>
      </div>
    </section>

    <Footer />
  </>
);

/* Utility class for glass cards (add to globals.css or keep inline) */
const glassCardClasses =
  "bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center shadow-lg hover:shadow-xl hover:bg-white/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer";

export default HeroSection;
