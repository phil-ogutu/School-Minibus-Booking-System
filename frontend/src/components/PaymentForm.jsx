// This is the payment form
"use client";
import { useEffect, useState } from "react";
import MpesaPayment from "./MpesaPayment";

export default function PaymentForm({ tripId }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const amount = 100; // fixed for demo

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    setName(user.name || "");
  }, []);

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
      />
    </div>
  );
}
