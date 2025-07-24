"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";

export default function AdminDashboard() {
  // dummy stats; replace with real API data later
  const stats = [
    { label: "Total Buses", value: 5 },
    { label: "Total Routes", value: 8 },
    { label: "Total Bookings", value: 120 },
    { label: "Total Parents", value: 45 },
    { label: "Total Drivers", value: 12 },
  ];
  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 p-10 bg-gray-50 min-h-screen">
        <DashboardHeader title="Admin Dashboard" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* {["Total Buses", "Total Routes", "Total Bookings"].map((item) => ( */}
          {stats.map((stat) => (
            <div
              // key={item}
              key={stat.label}
              className="bg-white border rounded shadow p-6 text-center"
            >
              <p className="text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-amber-500">{stat.value}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
