"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { FaEdit, FaTrash } from "react-icons/fa";

const routes = [
  {
    id: 1,
    name: "Mombasa Road Route",
    mainRoad: "Mombasa Road",
    startPoint: "Kitengela",
    endPoint: "CBD",
    commonStages: "Kitengela, Mlolongo, Syokimau, South B, CBD",
    distanceKm: 30,
    busNumber: "KDA 123A",
  },
  {
    id: 2,
    name: "Outering Road Route",
    mainRoad: "Outering Road",
    startPoint: "Cabanas",
    endPoint: "Thika Road",
    commonStages: "Cabanas, Taj Mall, Pipeline, Allsops, Garden City",
    distanceKm: 18,
    busNumber: "KDB 456B",
  },
  {
    id: 3,
    name: "Thika Road Route",
    mainRoad: "Thika Road",
    startPoint: "Thika",
    endPoint: "CBD",
    commonStages: "Thika, Juja, Ruiru, Githurai, Kasarani, CBD",
    distanceKm: 45,
    busNumber: "KDC 789C",
  },
];

export default function ManageRoutes() {
  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 p-10 bg-gray-50 min-h-screen">
        <DashboardHeader title="Manage Routes" />

        <table className="min-w-full bg-white border rounded shadow">
          <thead className="bg-[#0F333F] text-white">
            <tr>
              <th className="px-4 py-2 border">Route Name</th>
              <th className="px-4 py-2 border">Main Road</th>
              <th className="px-4 py-2 border">Start Point</th>
              <th className="px-4 py-2 border">End Point</th>
              <th className="px-4 py-2 border">Common Stages</th>
              <th className="px-4 py-2 border">Distance (km)</th>
              <th className="px-4 py-2 border">Bus Number</th>
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
                <td className="border px-4 py-2">{route.busNumber}</td>
                <td className="border px-4 py-2 space-x-2">
                  <button className="bg-sky-500 text-white p-1 rounded hover:bg-sky-600">
                    <FaEdit />
                  </button>
                  <button className="bg-red-500 text-white p-1 rounded hover:bg-red-600">
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
