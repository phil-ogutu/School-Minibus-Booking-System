"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import DataTable from "@/components/DataTable";

const parents = [
  {
    id: 1,
    name: "John Mwangi",
    email: "john@example.com",
    phone: "+254700000001",
    bookings: 5,
    trips: 12,
  },
  {
    id: 2,
    name: "Jane Tawasa",
    email: "jane@example.com",
    phone: "+254700000002",
    bookings: 3,
    trips: 8,
  },
];

export default function Parents() {
  const columns = [
    { header: "Parent Name", accessor: "name" },
    // { header: "Children", accessor: "children" },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone" },
    { header: "Bookings", accessor: "bookings" },
    { header: "Trips", accessor: "trips" },
    {
      header: "Actions",
      accessor: "id",
      render: (id) => (
        <div className="flex space-x-2">
          <button
            onClick={() => alert(`Edit parent ${id}`)}
            className="bg-sky-500 text-white px-2 py-1 rounded hover:bg-sky-600"
          >
            Edit
          </button>
          <button
            onClick={() => alert(`Delete parent ${id}`)}
            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 p-10 bg-gray-50 min-h-screen">
        <DashboardHeader title="Parents & Children" />
        <DataTable columns={columns} data={parents} />{" "}
      </main>
    </div>
  );
}
