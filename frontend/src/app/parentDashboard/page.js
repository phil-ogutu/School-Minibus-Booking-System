// "use client";

// import React, { useState, useEffect } from "react";
// import DashboardSidebar from "@/components/DashboardSidebar";
// import DashboardHeader from "@/components/DashboardHeader";
// import BookingTable from "@/components/BookingTable";

// // Dummy data – replace this with actual API call later
// const fetchBookings = async () => {
//   // Replace with your actual API call
//   const res = await fetch("/api/bookings"); // Example endpoint
//   const data = await res.json();
//   return data.bookings; // Assuming data has a `bookings` field
// };

// export default function ParentDashboard() {
//   const [bookings, setBookings] = useState([]);

//   useEffect(() => {
//     const loadBookings = async () => {
//       const data = await fetchBookings();
//       setBookings(data);
//     };
//     loadBookings();
//   }, []);

//   return (
//     <div className="flex">
//       <DashboardSidebar />
//       <main className="flex-1 p-10">
//         <DashboardHeader title="Your Bookings" />

//         <p className="text-gray-600 mb-4">
//           Below are the bookings you've made. You can manage them as needed.
//         </p>

//         <BookingTable bookings={bookings} />
//       </main>
//     </div>
//   );
// }

// // ParentDashboard.js or ParentDashboard/page.js
// // The main page that shows the bookings.

"use client";

import React from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import BookingTable from "@/components/BookingTable";
import useFetchBookings from "@/hooks/useFetchBookings";

export default function ParentDashboard() {
  const { bookings, loading } = useFetchBookings();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-gray-600">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 p-10">
        <DashboardHeader title="Your Bookings" />
        <p className="text-gray-600 mb-4">
          Manage your bookings below. You can edit, cancel, or subscribe to future terms.
        </p>
        <BookingTable bookings={bookings} />
      </main>
    </div>
  );
}
