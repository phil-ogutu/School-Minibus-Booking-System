"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import DataTable from "@/components/DataTable";

const bookings = [
  {
    id: 1,
    student: "John Doe",
    route: "Route A",
    bus: "KDA 123A",
    driver: "Peter Kamau",
    pickup: "CBD Stage",
    dropoff: "Westlands School Gate",
    dateTime: "22/07/2024 07:00 - 16:00",
    status: "Confirmed",
  },
  {
    id: 2,
    student: "Jane Smith",
    route: "Route B",
    bus: "KDB 456B",
    driver: "Mary Otieno",
    pickup: "Eastleigh Stop 5",
    dropoff: "Karen School Gate",
    dateTime: "22/07/2024 06:45 - 15:45",
    status: "Pending",
  },
];

export default function ViewBookings() {
  const columns = [
    { header: "Student", accessor: "student" },
    { header: "Route", accessor: "route" },
    { header: "Bus", accessor: "bus" },
    { header: "Driver", accessor: "driver" },
    { header: "Pickup", accessor: "pickup" },
    { header: "Drop-off", accessor: "dropoff" },
    { header: "Date & Time", accessor: "dateTime" },
    { header: "Status", accessor: "status" },
  ];

  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 p-10 bg-gray-50 min-h-screen">
        <DashboardHeader title="View Bookings" />

        <DataTable columns={columns} data={bookings} />
      </main>
    </div>
  );
}
