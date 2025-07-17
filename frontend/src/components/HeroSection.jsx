"use client";
import Image from "next/image";
import Button from "./Button";

const HeroSection = () => {
  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Hero text */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Affordable, Reliable School Transport for Every Family.
          </h1>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            All in one platform built for your family’s peace of mind.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="flex flex-col md:flex-row justify-center gap-6 w-full max-w-5xl mb-12">
          {["Safe Rides", "Real-Time Tracking", "Easy Booking"].map(
            (feature) => (
              <div
                key={feature}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-8 text-center shadow hover:shadow-md transition"
              >
                <p className="font-semibold text-gray-800 text-xl">{feature}</p>
              </div>
            )
          )}
        </div>

        {/* Call to Action button */}
        <div className="mb-16">
          <Button href="/login" variant="primary" size="lg">
            Book your ride
          </Button>
        </div>

        {/* Bus Image */}
        <div className="w-full flex justify-center">
          <Image
            src="/bus-hero.png"
            alt="School Bus with children"
            width={900}
            height={600}
            priority
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
