"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import DataTable from "@/components/DataTable";

const parents = [
  { id: 1, name: "John Doe", children: "Alice M., Ben M." },
  { id: 2, name: "Jane Smith", children: "Clara S." },
];

export default function ParentsChildren() {
  const columns = [
    { header: "Parent Name", accessor: "name" },
    { header: "Children", accessor: "children" },
  ];

  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 p-10 bg-gray-50 min-h-screen">
        <DashboardHeader title="Parents & Children" />

        <DataTable columns={columns} data={parents} />
      </main>
    </div>
  );
}
