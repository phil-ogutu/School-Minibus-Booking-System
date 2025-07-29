// // This is the page handling payments
// "use client";
// import PaymentForm from "@/components/PaymentForm";

// export default async function PaymentPage({ searchParams }) {
//   const tripId = await searchParams; //await here

//   if (!tripId) {
//     return (
//       <div className="p-6 text-red-600">
//         Missing tripId. Please go back and select a trip.
//       </div>
//     );
//   }
//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-semibold mb-4">Confirm and Pay</h2>
//       <PaymentForm tripId={tripId} />
//     </div>
//   );
// }

// app/payment/page.jsx
"use client";
import PaymentForm from "@/components/PaymentForm";
import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function PaymentPage({ searchParams }) {
  const tripId = searchParams?.tripId;

  if (!tripId) {
    return (
      <div className="p-6 text-red-600">
        Missing tripId. Please go back and select a trip.
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Background Bus Image */}
      <div className="absolute top-0 left-0 w-full h-[40vh] md:h-[60vh] z-0">
        <Image
          src="/images/bus-hero.jpg" // Make sure this image exists in /public/images
          alt="Bus Hero"
          layout="fill"
          objectFit="cover"
          className="opacity-50"
          priority
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />

        <div className="max-w-3xl mx-auto mt-[25vh] md:mt-[35vh] p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Confirm and Pay
          </h2>
          <p className="text-gray-600 text-sm mb-6 text-center">
            You're almost done! Please confirm your booking and complete your
            payment below.
          </p>
          <PaymentForm tripId={tripId} />
        </div>
      </div>
    </div>
  );
}
