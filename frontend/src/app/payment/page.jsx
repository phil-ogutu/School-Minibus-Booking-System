// This is the page handling payments
"use client";
import PaymentForm from "@/components/PaymentForm";

export default function PaymentPage({ searchParams }) {
  const tripId = searchParams?.tripId || "";
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Confirm and Pay</h2>
      <PaymentForm tripId={tripId} />
    </div>
  );
}
