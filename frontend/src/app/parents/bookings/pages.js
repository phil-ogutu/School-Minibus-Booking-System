"use client";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";

export default function MyBookings() {
  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 p-10">
        <DashboardHeader title="My Bookings" />
        <p className="text-gray-600">Your booked trips will appear here.</p>
      </main>
    </div>
  );
}
// This page displays the bookings made by the parent
// It includes the sidebar and header components, setting up the layout for the bookings page.
