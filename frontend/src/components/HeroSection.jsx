"use client";
import Image from "next/image";
import Button from "./Button";
import Footer from "./Footer";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import {
  FaMapPin,
  FaMobileAlt,
  FaShieldAlt,
  FaUsers,
  FaClock,
  FaHeadphones,
  FaStar,
  FaBus,
  FaUserTie,
} from "react-icons/fa";

const HeroSection = () => (
  <>
    {/* HERO */}
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <Image
        src="/bus-hero.png"
        alt="School Bus with children"
        fill
        priority
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50 z-0"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center text-white space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-6xl font-extrabold"
        >
          Affordable, Reliable School Transport for Every Family.
        </motion.h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto">
          All in one platform built for your family’s peace of mind.
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              title: "Safe Rides",
              icon: FaShieldAlt,
              desc: "Background-checked drivers & GPS-monitored buses.",
            },
            {
              title: "Real-Time Tracking",
              icon: FaMapPin,
              desc: "Track your child’s bus location & arrival times.",
            },
            {
              title: "Easy Booking",
              icon: FaMobileAlt,
              desc: "Book, modify & manage rides in seconds.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center shadow-lg"
            >
              <item.icon className="w-10 h-10 text-yellow-400 mb-3 mx-auto" />
              <h3 className="font-bold text-xl mb-2">{item.title}</h3>
              <p className="text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <Button href="/bookings" variant="primary" size="lg">
          Book your ride
        </Button>
      </div>
    </section>

    {/* STATISTICS */}
    <section className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {[
          {
            icon: FaUsers,
            end: 10000,
            suffix: "+",
            label: "Happy Families",
            color: "text-blue-600",
          },
          {
            icon: FaClock,
            end: 99.9,
            suffix: "%",
            label: "On-Time Arrival",
            color: "text-green-600",
          },
          {
            icon: FaUserTie,
            end: 500,
            suffix: "+",
            label: "Qualified Drivers",
            color: "text-purple-600",
          },
          {
            icon: FaHeadphones,
            end: 24,
            suffix: "/7",
            label: "Support",
            color: "text-orange-600",
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className=""
          >
            <stat.icon className={`w-10 h-10 mx-auto mb-2 ${stat.color}`} />
            <div className={`text-3xl font-bold ${stat.color}`}>
              <CountUp end={stat.end} duration={2} suffix={stat.suffix} />
            </div>
            <p className="text-gray-600">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* USER JOURNEY */}
    <section className="bg-gray-50 py-20">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-10">
          Your Journey with SkoolaBus
        </h2>
        <div className="grid md:grid-cols-4 gap-8 text-left">
          {[
            "Sign up & create your profile.",
            "Choose or customize your child’s route.",
            "Track the bus in real-time every day.",
            "Rate rides & manage bookings seamlessly.",
          ].map((step, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl shadow p-6"
            >
              <div className="text-2xl font-bold mb-2">{i + 1}</div>
              <p>{step}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* TESTIMONIALS */}
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-10">What Parents Say</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-100 rounded-xl p-6 shadow"
            >
              <p>
                "SkoolaBus has made mornings stress-free and we trust the
                drivers completely!"
              </p>
              <div className="mt-4 font-semibold">Parent {i}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* OUR BUSES & DRIVERS */}
    <section className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-10">Meet Our Buses & Drivers</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl shadow p-4"
            >
              <Image
                src="/bus-hero.png"
                alt={`Bus ${i}`}
                width={400}
                height={300}
                className="rounded mb-4"
              />
              <h3 className="font-bold">Driver {i}</h3>
              <p>Route: Kasarani - CBD</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* FAQs */}
    <section className="bg-white py-20">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-10 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {[
            {
              q: "How do I book a ride?",
              a: "Sign up, choose your route, and book easily via our app or website.",
            },
            {
              q: "Is my child’s location tracked in real-time?",
              a: "Yes, every bus is GPS enabled for live tracking.",
            },
            {
              q: "What if I need to cancel or modify a booking?",
              a: "Bookings can be modified or cancelled under your profile settings.",
            },
          ].map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
            >
              <h4 className="font-bold text-lg mb-2">{faq.q}</h4>
              <p className="text-gray-700">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <Footer />
  </>
);

export default HeroSection;
