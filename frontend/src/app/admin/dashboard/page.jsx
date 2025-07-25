"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { useBuses } from "@/hooks/useBuses";
import { useBookings } from "@/hooks/useBookings";
import { useRoutes } from "@/hooks/useRoutes";

export default function AdminDashboard() {
  // dummy stats; replace with real API data later
    const { buses } = useBuses();
    const { bookings } = useBookings();
    const { routes } = useRoutes()

    console.log('mm', routes)
    
  const stats = [
    { label: "Total Buses", value:  buses && buses.length },
    { label: "Total Routes", value: routes && routes.length },
    { label: "Total Bookings", value: bookings && bookings.length},
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
