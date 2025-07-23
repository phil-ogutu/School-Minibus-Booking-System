"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import DataTable from "@/components/DataTable";

const ownerships = [
  {
    id: 1,
    ownerName: "Green Transport Ltd",
    busNumber: "KDA 123A",
    contact: "+254 700 123 456",
  },
  {
    id: 2,
    ownerName: "Mary Otieno",
    busNumber: "KDB 456B",
    contact: "+254 711 987 654",
  },
];

export default function BusOwners() {
  const columns = [
    { header: "Owner Name", accessor: "ownerName" },
    { header: "Bus Number", accessor: "busNumber" },
    { header: "Contact", accessor: "contact" },
  ];

  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 p-10 bg-gray-50 min-h-screen">
        <DashboardHeader title="Bus Ownership Management" />
        <DataTable columns={columns} data={ownerships} />
      </main>
    </div>
  );
}
