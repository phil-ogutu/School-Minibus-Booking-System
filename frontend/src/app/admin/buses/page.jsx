"use client";

import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { useBuses } from "@/hooks/useBuses"; // Import the hook
import axiosInstance from "@/lib/api";

export default function ManageBuses() {
  const { buses, busesLoading, busesError, createNewBus, deleteExistingBus } = useBuses(); // Using the hook

  const [newBus, setNewBus] = useState({
    plate: "",
    capacity: "",
    driver: "",
  });

  const [driverNames, setDriverNames] = useState({});

  // Fetch driver names for all buses
  const fetchDriverNames = async () => {
    try {
      const driverIds = buses.map((bus) => bus.driver_id);
      const uniqueDriverIds = [...new Set(driverIds)]; // Remove duplicate driver IDs

      // Fetch names for all unique driver IDs
      const driverResponses = await Promise.all(
        uniqueDriverIds.map((id) =>
          axiosInstance.get(`/drivers/${id}`).then((response) => ({
            id,
            name: response.data.driver_name,
          }))
        )
      );

      // Map the driver data into an object for quick lookup
      const driversMap = driverResponses.reduce((acc, { id, name }) => {
        acc[id] = name;
        return acc;
      }, {});

      setDriverNames(driversMap);
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  };

  useEffect(() => {
    if (!busesLoading && buses && buses.length > 0) {
      fetchDriverNames();
    }
  }, [busesLoading, buses]);

  const handleAddBus = async () => {
    const bus = {
      ...newBus,
      capacity: parseInt(newBus.capacity),
    };

    try {
      await createNewBus(bus); // Create bus via API
      setNewBus({ plate: "", capacity: "", driver: "" }); // Reset input fields after adding
    } catch (error) {
      console.error("Error creating bus:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteExistingBus(id); // Delete bus via API
    } catch (error) {
      console.error("Error deleting bus:", error);
    }
  };

  if (busesLoading) {
    return <div>Loading buses...</div>; // Loading state
  }

  if (busesError) {
    return <div>Error loading buses: {busesError}</div>; // Error state
  }

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
              value={newBus.plate}
              onChange={(e) =>
                setNewBus({ ...newBus, plate: e.target.value })
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
                <td className="border px-4 py-2">{bus.plate}</td>
                <td className="border px-4 py-2">{bus.capacity}</td>
                <td className="border px-4 py-2">
                  {driverNames[bus.driver_id] || "Loading..."}
                </td>
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
