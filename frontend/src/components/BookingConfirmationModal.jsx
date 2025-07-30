"use client";
import { useState } from "react";
import Image from "next/image";
import Button from "@/components/Button";

//  reusable success modal
function SuccessModal({ open, onClose }) {
  if (!open) return null;

  return (
    // close on backdrop click
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      {/*  stay open on card click*/}
      <div
        className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h4 className="text-xl font-bold mb-2">Payment Received ✅</h4>
        <p className="text-gray-600 mb-4">
          You’ll receive an SMS confirmation shortly.
        </p>
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  );
}

export default function PaymentForm({ tripId }) {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [paying, setPaying] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handlePayment = async () => {
    setPaying(true);
    setError("");
    try {
      const res = await fetch("/api/payments/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, tripId }),
      });
      const data = await res.json();

      if (res.ok) {
        setConfirmed(true);
        setShowModal(true);
      } else {
        setError(data?.message || "Payment failed. Try again.");
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="relative max-w-md w-full bg-white rounded-xl shadow-lg p-6 mt-6 mx-auto">
      <div className="absolute top-4 right-4">
        <Image
          src="/images/bus-logo.png"
          alt="Bus Logo"
          width={40}
          height={40}
        />
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

      {/* Re-use the SuccessModal */}
      <SuccessModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
