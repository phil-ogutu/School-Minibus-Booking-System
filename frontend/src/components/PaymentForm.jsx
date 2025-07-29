// /components/PaymentForm.jsx
"use client";
import { useState, useEffect } from "react";
import Notification from "./Notification";

export default function PaymentForm({ tripId }) {
  const [form, setForm] = useState({ name: "", phone: "", amount: "", tripId });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // simulate pulling from auth token/localStorage
    const user = JSON.parse(localStorage.getItem("user")) || {};
    setForm((prev) => ({ ...prev, name: user.name || "" }));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const result = await res.json();
    setLoading(false);
    if (result.success) {
      setMessage("STK push sent! Confirm payment on your phone.");
    } else {
      setMessage("Failed to send STK push. Try again.");
    }
  };

  return (
    <div>
      {message && <Notification message={message} />}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border p-2"
          placeholder="Your Name"
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
          className="w-full border p-2"
          placeholder="07XXXXXXXX"
        />
        <input
          name="amount"
          value={form.amount}
          onChange={handleChange}
          required
          className="w-full border p-2"
          placeholder="Amount"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
}
