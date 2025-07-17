"use client";

import { useParams } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";

export default function TrackTrip() {
  const { bookingId } = useParams();
  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 p-10">
        <DashboardHeader title={`Live Tracking #${bookingId}`} />
        <p className="text-gray-600">Map with live bus location goes here.</p>
      </main>
    </div>
  );
}
// This page is for tracking a specific booking by its ID
// It includes the sidebar and header components, setting up the layout for the tracking page.
// The bookingId is extracted from the URL parameters using useParams from Next.js.
// The page is designed to show a map with the live location of the bus associated with the booking.
// The "use client" directive indicates that this component should be rendered on the client side.
// The layout includes a sidebar for navigation and a header for context, making it consistent with other pages in the application.
