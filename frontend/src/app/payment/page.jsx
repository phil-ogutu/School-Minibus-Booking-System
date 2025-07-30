// // This is the page handling payments

// "use client";
// import PaymentForm from "@/components/PaymentForm";
// import Navbar from "@/components/Navbar";
// import Image from "next/image";

// export default async function PaymentPage({ searchParams }) {
//   const tripId = await searchParams;

//   if (!tripId) {
//     return (
//       <div className="p-6 text-red-600">
//         Missing tripId. Please go back and select a trip.
//       </div>
//     );
//   }

//   return (
//     <div className="relative min-h-screen bg-gray-100">
//       {/* Background Bus Image */}
//       <div className="absolute top-0 left-0 w-full h-[40vh] md:h-[60vh] z-0">
//         <Image
//           src="public/bus-hero.png" // Make sure this image exists in /public/images
//           alt="Bus Hero"
//           layout="fill"
//           objectFit="cover"
//           className="opacity-50"
//           priority
//         />
//       </div>

//       {/* Content */}
//       <div className="relative z-10">
//         <Navbar />

//         <div className="max-w-3xl mx-auto mt-[25vh] md:mt-[35vh] p-6 bg-white rounded-lg shadow-lg">
//           <h2 className="text-2xl font-semibold mb-4 text-center">
//             Confirm and Pay
//           </h2>
//           <p className="text-gray-600 text-sm mb-6 text-center">
//             You're almost done! Please confirm your booking and complete your
//             payment below.
//           </p>
//           <PaymentForm tripId={tripId} />
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

// Collect user input for M-pesa STK request
import { useState } from "react";
import Image from "next/image";
import Button from "@/components/Button";
import SuccessModal from "@/components/BookingConfirmationModal";

//Loading & UI states
export default function PaymentForm({ tripId }) {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [paying, setPaying] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  //POST to backend endpoint
  const handlePayment = async () => {
    setPaying(true);
    setError("");
    try {
      // Simulate API call
      const res = await fetch("/api/payments/stk-push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phone, tripId }),
      });
      const data = await res.json();

      if (res.ok) {
        setConfirmed(true);
        setShowModal(true);
      } else {
        setError(data?.message || "Payment failed. Try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="relative max-w-md w-full bg-white rounded-xl shadow-lg p-6 mt-6 mx-auto">
      {/* Bus Logo */}
      <div className="absolute top-4 right-4">
        <Image src="/bus-hero.png" alt="Bus Logo" width={40} height={40} />
      </div>

      <h3 className="text-2xl font-bold text-center mb-4">Mpesa Payment</h3>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handlePayment();
        }}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-yellow-500"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Phone Number (Safaricom)
          </label>
          <input
            required
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-yellow-500"
            placeholder="e.g. 0712345678"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button
          type="submit"
          disabled={paying || confirmed}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          {paying ? "Processing..." : confirmed ? "Paid" : "Pay with Mpesa"}
        </Button>
      </form>

      <SuccessModal open={showModal} onClose={() => setShowModal(false)}>
        <div className="text-center">
          <h4 className="text-xl font-bold mb-2">Payment Received ✅</h4>
          <p className="text-gray-600">
            You’ll receive an SMS confirmation shortly.
          </p>
          <button
            className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-md"
            onClick={() => setShowModal(false)}
          >
            Close
          </button>
        </div>
      </SuccessModal>
    </div>
  );
}
