"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const initialRoutes = [
  {
    id: 1,
    name: "Mombasa Road Route",
    mainRoad: "Mombasa Road",
    startPoint: "Kitengela",
    endPoint: "CBD",
    commonStages: "Kitengela, Mlolongo, Syokimau, South B, CBD",
    distanceKm: 30,
  },
  {
    id: 2,
    name: "Outering Road Route",
    mainRoad: "Outering Road",
    startPoint: "Cabanas",
    endPoint: "Thika Road",
    commonStages: "Cabanas, Taj Mall, Pipeline, Allsops, Garden City",
    distanceKm: 18,
  },
  {
    id: 3,
    name: "Thika Road Route",
    mainRoad: "Thika Road",
    startPoint: "Thika",
    endPoint: "CBD",
    commonStages: "Thika, Juja, Ruiru, Githurai, Kasarani, CBD",
    distanceKm: 45,
  },
];

export default function ManageRoutes() {
  const [routes, setRoutes] = useState(initialRoutes);
  const [newRoute, setNewRoute] = useState({
    name: "",
    mainRoad: "",
    startPoint: "",
    endPoint: "",
    commonStages: "",
    distanceKm: "",
  });

  const handleAddRoute = () => {
    if (
      !newRoute.name ||
      !newRoute.mainRoad ||
      !newRoute.startPoint ||
      !newRoute.endPoint ||
      !newRoute.commonStages ||
      !newRoute.distanceKm
    ) {
      alert("Please fill in all fields");
      return;
    }

    const route = {
      ...newRoute,
      id: Date.now(),
      distanceKm: parseFloat(newRoute.distanceKm),
    };
    setRoutes((prev) => [...prev, route]);
    setNewRoute({
      name: "",
      mainRoad: "",
      startPoint: "",
      endPoint: "",
      commonStages: "",
      distanceKm: "",
    });
  };

  const handleDelete = (id) => {
    setRoutes((prev) => prev.filter((route) => route.id !== id));
  };

  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 p-10 bg-gray-50 min-h-screen">
        <DashboardHeader title="Manage Routes" />

        {/* Add New Route Section */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-2">Add New Route</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Route Name"
              value={newRoute.name}
              onChange={(e) =>
                setNewRoute({ ...newRoute, name: e.target.value })
              }
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Main Road"
              value={newRoute.mainRoad}
              onChange={(e) =>
                setNewRoute({ ...newRoute, mainRoad: e.target.value })
              }
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Start Point"
              value={newRoute.startPoint}
              onChange={(e) =>
                setNewRoute({ ...newRoute, startPoint: e.target.value })
              }
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="End Point"
              value={newRoute.endPoint}
              onChange={(e) =>
                setNewRoute({ ...newRoute, endPoint: e.target.value })
              }
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Common Stages"
              value={newRoute.commonStages}
              onChange={(e) =>
                setNewRoute({ ...newRoute, commonStages: e.target.value })
              }
              className="p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Distance (km)"
              value={newRoute.distanceKm}
              onChange={(e) =>
                setNewRoute({ ...newRoute, distanceKm: e.target.value })
              }
              className="p-2 border rounded"
            />
          </div>
          <button
            onClick={handleAddRoute}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center"
          >
            <FaPlus className="mr-2" /> Add Route
          </button>
        </section>

        {/* Routes Table */}
        <table className="min-w-full bg-white border rounded shadow">
          <thead className="bg-[#0F333F] text-white">
            <tr>
              <th className="px-4 py-2 border">Route Name</th>
              <th className="px-4 py-2 border">Main Road</th>
              <th className="px-4 py-2 border">Start Point</th>
              <th className="px-4 py-2 border">End Point</th>
              <th className="px-4 py-2 border">Common Stages</th>
              <th className="px-4 py-2 border">Distance (km)</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((route) => (
              <tr key={route.id} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{route.name}</td>
                <td className="border px-4 py-2">{route.mainRoad}</td>
                <td className="border px-4 py-2">{route.startPoint}</td>
                <td className="border px-4 py-2">{route.endPoint}</td>
                <td className="border px-4 py-2">{route.commonStages}</td>
                <td className="border px-4 py-2">{route.distanceKm} km</td>
                <td className="border px-4 py-2 space-x-2">
                  <button className="bg-sky-500 text-white p-1 rounded hover:bg-sky-600">
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(route.id)}
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
