// This is the payment form
"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import MpesaPayment from "@/components/MpesaButton";

export default function PaymentForm({ tripId }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const amount = 100; // fixed for demo

  /* Pull name once */
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    setName(user.name || "");
  }, []);

  /* Optional callback when payment succeeds */
  const handleSuccess = () => toast.success("Payment initiated!");

  return (
    <div className="space-y-4 max-w-md">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your Name"
        className="w-full border p-2"
      />
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="07XXXXXXXX"
        className="w-full border p-2"
      />
      <MpesaPayment
        amount={amount}
        name={name}
        phone={phone}
        bookingId={tripId}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
