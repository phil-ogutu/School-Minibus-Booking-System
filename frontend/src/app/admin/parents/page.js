"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import DataTable from "@/components/DataTable";
import { FaEdit, FaTrash } from "react-icons/fa";

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
  const [editParent, setEditParent] = useState(null);

  const handleEdit = (parent) => {
    setEditParent(parent);
  };

  const handleDelete = (id) => {
    alert(`Delete parent ${id}`);
    // Implement actual delete logic here
  };

  const columns = [
    { header: "Parent Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone" },
    { header: "Bookings", accessor: "bookings" },
    { header: "Trips", accessor: "trips" },
    {
      header: "Actions",
      accessor: "id",
      render: (id, row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(row)}
            className="bg-sky-500 text-white p-1 rounded hover:bg-sky-600"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDelete(id)}
            className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
          >
            <FaTrash />
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

        <DataTable columns={columns} data={parents} />

        {/* Edit Parent Modal */}
        {editParent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Edit Parent</h2>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Save changes logic goes here");
                  setEditParent(null);
                }}
              >
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={editParent.name}
                    onChange={(e) =>
                      setEditParent({ ...editParent, name: e.target.value })
                    }
                    className="p-2 border rounded w-full"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={editParent.email}
                    onChange={(e) =>
                      setEditParent({ ...editParent, email: e.target.value })
                    }
                    className="p-2 border rounded w-full"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Phone</label>
                  <input
                    type="text"
                    value={editParent.phone}
                    onChange={(e) =>
                      setEditParent({ ...editParent, phone: e.target.value })
                    }
                    className="p-2 border rounded w-full"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditParent(null)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
