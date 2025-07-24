"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import DataTable from "@/components/DataTable";
import { useBookings } from "@/hooks/useBookings";

// const bookings = [
//   {
//     id: 1,
//     student: "John Doe",
//     route: "Route A",
//     bus: "KDA 123A",
//     driver: "Peter Kamau",
//     pickup: "CBD Stage",
//     dropoff: "Westlands School Gate",
//     dateTime: "22/07/2024 07:00 - 16:00",
//     status: "Confirmed",
//   },
//   {
//     id: 2,
//     student: "Jane Smith",
//     route: "Route B",
//     bus: "KDB 456B",
//     driver: "Mary Otieno",
//     pickup: "Eastleigh Stop 5",
//     dropoff: "Karen School Gate",
//     dateTime: "22/07/2024 06:45 - 15:45",
//     status: "Pending",
//   },
// ];

export default function ViewBookings() {
  const columns = [
    { header: "Student", accessor: "child_name" },
    { header: "Parent Name", accessor: "parent.username" },
    { header: "Parent Phone", accessor: "parent.phone" },
    { header: "Parent Email", accessor: "parent.email" },
    { header: "Route", accessor: "bus.route.start" },
    { header: "Bus", accessor: "bus.plate" },
    { header: "Driver", accessor: "bus.driver.driver_name" },
    { header: "Pickup", accessor: "pickup" },
    { header: "Drop-off", accessor: "dropoff" },
    { header: "Date & Time", accessor: "dateTime" },
    { header: "Status", accessor: "status" },
    { header: "Actions", accessor: "actions" }, // Placeholder for actions like edit/delete
  ];
  const { bookings } = useBookings();
  console.log('admin-bookings: ', bookings)

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
