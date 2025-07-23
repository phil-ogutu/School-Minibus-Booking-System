// parentDashboard/children/page.js
"use client";

// import { useUser } from "@/context/UserContext"; // Import the useUser hook to access user data
import { useUser } from "@/context/UserContext";
import ParentDashboardSidebar from "@/components/ParentDashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import DataTable from "@/components/DataTable";

export default function ParentsChildren() {
  // Access the user data from context
  const { user, loading, error } = useUser();

  // Loading and error handling
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Extracting children and their associated bus info from the bookings
  const children = user?.bookings.map((booking) => ({
    name: booking.child_name, // Child's name
    bus: booking.bus.plate,   // Bus plate (or any other bus-related info you want to show)
  })) || []; // Fallback to an empty array if there are no bookings

  const columns = [
    { header: "Child Name", accessor: "name" },
    { header: "Bus Plate", accessor: "bus" },
  ];

  return (
    <div className="flex">
      <ParentDashboardSidebar />
      <main className="flex-1 p-10 bg-gray-50 min-h-screen">
        <DashboardHeader title="Parents & Children" />
        {children.length > 0 ? (
          <DataTable columns={columns} data={children} />
        ) : (
          <div>No children found in bookings.</div>
        )}
      </main>
    </div>
  );
}

// This page is currently commented out from the parentDashboard (app/parentDashboard/page.js). It's not shown in the UI