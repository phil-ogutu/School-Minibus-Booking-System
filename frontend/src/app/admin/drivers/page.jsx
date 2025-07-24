"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import DataTable from "@/components/DataTable";
import { FaPlus } from "react-icons/fa";

export default function Drivers() {
  const [drivers, setDrivers] = useState([
    {
      id: 1,
      name: "Peter Kamau",
      phone: "+254700000001",
      idNumber: "12345678",
      email: "peter@example.com",
      residence: "Nairobi",
      atWork: true,
      startTime: "08:00",
      endTime: "17:00",
      trips: 5,
      route: "Thika Road",
    },
    {
      id: 2,
      name: "Mary Otieno",
      phone: "+254700000002",
      idNumber: "87654321",
      email: "mary@example.com",
      residence: "Kitengela",
      atWork: false,
      startTime: "09:00",
      endTime: "16:00",
      trips: 3,
      route: "Mombasa Road",
    },
  ]);

  const [newDriver, setNewDriver] = useState({
    name: "",
    phone: "",
    idNumber: "",
    email: "",
    residence: "",
  });

  const handleAddDriver = () => {
    const driver = {
      ...newDriver,
      id: Date.now(),
      atWork: false,
      startTime: "",
      endTime: "",
      trips: 0,
      route: "-",
    };
    setDrivers((prev) => [...prev, driver]);
    setNewDriver({
      name: "",
      phone: "",
      idNumber: "",
      email: "",
      residence: "",
    });
  };

  const handleEdit = (id) => alert(`Edit driver ${id}`);
  const handleDelete = (id) =>
    setDrivers((prev) => prev.filter((d) => d.id !== id));

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Phone", accessor: "phone" },
    { header: "ID Number", accessor: "idNumber" },
    { header: "Email", accessor: "email" },
    { header: "Residence", accessor: "residence" },
    {
      header: "At Work?",
      accessor: "atWork",
      render: (value) => (value ? "Yes" : "No"),
    },
    { header: "Start Time", accessor: "startTime" },
    { header: "End Time", accessor: "endTime" },
    { header: "Trips Done", accessor: "trips" },
    { header: "Route", accessor: "route" },
    {
      header: "Actions",
      accessor: "id",
      render: (id) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(id)}
            className="bg-sky-500 text-white px-2 py-1 rounded hover:bg-sky-600"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(id)}
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
        <DashboardHeader title="Manage Drivers" />

        {/* Add New Driver Form */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Add New Driver</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <input
              type="text"
              placeholder="Name"
              value={newDriver.name}
              onChange={(e) =>
                setNewDriver({ ...newDriver, name: e.target.value })
              }
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Phone"
              value={newDriver.phone}
              onChange={(e) =>
                setNewDriver({ ...newDriver, phone: e.target.value })
              }
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="ID Number"
              value={newDriver.idNumber}
              onChange={(e) =>
                setNewDriver({ ...newDriver, idNumber: e.target.value })
              }
              className="p-2 border rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={newDriver.email}
              onChange={(e) =>
                setNewDriver({ ...newDriver, email: e.target.value })
              }
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Residence"
              value={newDriver.residence}
              onChange={(e) =>
                setNewDriver({ ...newDriver, residence: e.target.value })
              }
              className="p-2 border rounded"
            />
            <button
              onClick={handleAddDriver}
              className="bg-green-600 text-white p-2 rounded hover:bg-green-700 flex items-center justify-center"
            >
              <FaPlus className="mr-2" /> Add Driver
            </button>
          </div>
        </div>

        {/* Drivers Table */}
        <DataTable columns={columns} data={drivers} />
      </main>
    </div>
  );
}
