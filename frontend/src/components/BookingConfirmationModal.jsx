"use client";
import Button from "@/components/Button";

export default function SuccessModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
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
