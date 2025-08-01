// // mpesa payment button

// import { useState } from "react";
// import axios from "axios";

// export default function MpesaButton({ amount, phone }) {
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   const initiatePayment = async () => {
//     setLoading(true);
//     setMessage("");

//     try {
//       const response = await axios.post("http://localhost:5000/api/stkpush", {
//         phone,
//         amount,
//       });

//       if (response.data.ResponseCode === "0") {
//         setMessage("STK Push sent to your phone. Complete payment.");
//       } else {
//         setMessage("Payment initiation failed.");
//       }
//     } catch (error) {
//       setMessage("Error initiating payment.");
//       console.error(error);
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="space-y-2">
//       <button
//         onClick={initiatePayment}
//         className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//         disabled={loading}
//       >
//         {loading ? "Processing..." : "Pay with M-Pesa"}
//       </button>
//       {message && <p className="text-sm text-gray-700">{message}</p>}
//     </div>
//   );
// }

"use client";
import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function MpesaPayment({
  amount,
  name,
  bookingId,
  phone,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);

  const handlePay = useCallback(async () => {
    if (!phone || !amount) {
      toast.error("Phone & amount are required.");
      return;
    }
    setLoading(true);
    try {
      await axios.post("/api/payments/initiate", {
        phone,
        amount,
        name,
        bookingId,
      });
      toast.success("STK Push sent to your phone.");
      onSuccess?.();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Payment failed.");
    } finally {
      setLoading(false);
    }
  }, [amount, bookingId, name, onSuccess, phone]);

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
    >
      {loading ? "Processing..." : "Pay with M-Pesa"}
    </button>
  );
}
