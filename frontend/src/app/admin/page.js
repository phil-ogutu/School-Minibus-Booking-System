"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";

export default function AdminDashboard() {
  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 p-10">
        <DashboardHeader title="Admin Dashboard" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["Total Buses", "Total Routes", "Total Bookings"].map((item) => (
            <div
              key={item}
              className="bg-white border rounded shadow p-6 text-center"
            >
              <p className="text-gray-500">{item}</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
// This is the main entry point for the admin dashboard page
// It includes the sidebar and header components, setting up the layout for the admin dashboard.
