// This is the page handling payments
"use client";
import PaymentForm from "@/components/PaymentForm";

export default async function PaymentPage({ searchParams }) {
  const tripId = await searchParams; //await here

  if (!tripId) {
    return (
      <div className="p-6 text-red-600">
        Missing tripId. Please go back and select a trip.
      </div>
    );
  }
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Confirm and Pay</h2>
      <PaymentForm tripId={tripId} />
    </div>
  );
}
