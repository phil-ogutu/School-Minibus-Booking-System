"use client";
import Image from "next/image";
import Button from "./Button";

const HeroSection = () => {
  return (
    <section className="text-center py-16 px-4 bg-gray-50">
      <div className="max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Affordable, Reliable School Transport for Every Family.
        </h2>
        <div className="flex justify-center mb-8">
          <Button href="/login" variant="secondary">
            Book your ride
          </Button>
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
        {["Safe Rides", "Real-Time Tracking", "Easy Booking"].map((feature) => (
          <div
            key={feature}
            className="bg-white shadow-md rounded p-4 font-semibold"
          >
            {feature}
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
