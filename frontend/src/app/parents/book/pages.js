"use client";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";

export default function BookSeat() {
  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 p-10">
        <DashboardHeader title="Book a Seat" />
        <p className="text-gray-600">Booking form goes here.</p>
      </main>
    </div>
  );
}
// This is the page for booking a seat in the minibus
// It includes the sidebar and header components, setting up the layout for the booking page.
