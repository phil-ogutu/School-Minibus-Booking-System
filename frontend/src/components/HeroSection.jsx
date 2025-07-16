"use client";
import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="text-center py-16 px-4 bg-gray-50">
      <div className="max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Affordable, Reliable School Transport for Every Family.
        </h2>
        <div className="flex justify-center mb-8">
          <Link href="/login">
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded">
              Book your ride
            </button>
          </Link>
        </div>
      </div>

      <div className="flex justify-center mb-12">
        <Image
          src="/bus-hero.png"
          alt="School Bus with children"
          width={500}
          height={300}
          priority
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded p-4">
          <h3 className="font-semibold">Safe Rides</h3>
        </div>
        <div className="bg-white shadow-md rounded p-4">
          <h3 className="font-semibold">Real-Time Tracking</h3>
        </div>
        <div className="bg-white shadow-md rounded p-4">
          <h3 className="font-semibold">Easy Booking</h3>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
