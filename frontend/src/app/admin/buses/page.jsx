"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const initialBuses = [
  { id: 1, numberPlate: "KDA 123A", capacity: 40, driver: "Peter Kamau" },
  { id: 2, numberPlate: "KDB 456B", capacity: 30, driver: "Mary Otieno" },
];

export default function ManageBuses() {
  const [buses, setBuses] = useState(initialBuses);
  const [newBus, setNewBus] = useState({
    numberPlate: "",
    capacity: "",
    driver: "",
  });

  const handleAddBus = () => {
    const bus = {
      ...newBus,
      id: Date.now(),
      capacity: parseInt(newBus.capacity),
    };
    setBuses([...buses, bus]);
    setNewBus({ numberPlate: "", capacity: "", driver: "" });
  };

  const handleDelete = (id) => setBuses(buses.filter((bus) => bus.id !== id));

  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 p-10 bg-gray-50 min-h-screen">
        <DashboardHeader title="Manage Buses" />

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Add New Bus</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              placeholder="Number Plate"
              value={newBus.numberPlate}
              onChange={(e) =>
                setNewBus({ ...newBus, numberPlate: e.target.value })
              }
              className="p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Capacity"
              value={newBus.capacity}
              onChange={(e) =>
                setNewBus({ ...newBus, capacity: e.target.value })
              }
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Driver"
              value={newBus.driver}
              onChange={(e) => setNewBus({ ...newBus, driver: e.target.value })}
              className="p-2 border rounded"
            />
            <button
              onClick={handleAddBus}
              className="bg-amber-500 text-white p-2 rounded hover:bg-amber-600 flex items-center justify-center"
            >
              <FaPlus className="mr-2" /> Add
            </button>
          </div>
        </div>

        <table className="min-w-full bg-white border rounded">
          <thead className="bg-[#0F333F] text-white">
            <tr>
              <th className="px-4 py-2 border">Number Plate</th>
              <th className="px-4 py-2 border">Capacity</th>
              <th className="px-4 py-2 border">Driver</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {buses.map((bus) => (
              <tr key={bus.id} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{bus.numberPlate}</td>
                <td className="border px-4 py-2">{bus.capacity}</td>
                <td className="border px-4 py-2">{bus.driver}</td>
                <td className="border px-4 py-2 space-x-2">
                  <button className="bg-sky-500 text-white p-1 rounded hover:bg-sky-600">
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(bus.id)}
                    className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
