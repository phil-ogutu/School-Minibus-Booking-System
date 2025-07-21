"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import DataTable from "@/components/DataTable";

const routes = [
  {
    id: 1,
    name: "Route A",
    pickupPoints: "Point 1, Point 2, Point 3",
    busNumber: "KDA 123A",
  },
  {
    id: 2,
    name: "Route B",
    pickupPoints: "Point 4, Point 5",
    busNumber: "KDB 456B",
  },
];

export default function ManageRoutes() {
  const columns = [
    { header: "Route Name", accessor: "name" },
    { header: "Pickup Points", accessor: "pickupPoints" },
    { header: "Bus Number", accessor: "busNumber" },
  ];

  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 p-10 bg-gray-50 min-h-screen">
        <DashboardHeader title="Manage Routes" />

        <DataTable columns={columns} data={routes} />
      </main>
    </div>
  );
}
