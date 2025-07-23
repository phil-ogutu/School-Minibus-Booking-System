// app/parentDashboard/page.js
"use client";

// import { useUser } from "@/context/UserContext"; // Import the useUser hook to access user data
import { useUser } from "@/context/UserContext";
import ParentDashboardSidebar from "@/components/ParentDashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";

export default function AdminDashboard() {
  // Access the user data from context
  const { user, loading, error } = useUser();

  // Loading and error handling
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Count the number of bookings (if any)
  const totalBookings = user?.bookings?.length || 0; // Default to 0 if no bookings exist

  return (
    <div className="flex">
      <ParentDashboardSidebar />
      <main className="flex-1 p-10 bg-gray-50 min-h-screen">
        <DashboardHeader title="Parent Dashboard" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["Total Bookings"].map((item) => (
            <div
              key={item}
              className="bg-white border rounded shadow p-6 text-center"
            >
              <p className="text-gray-500">{item}</p>
              <p className="text-2xl font-bold text-amber-500">{totalBookings}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
