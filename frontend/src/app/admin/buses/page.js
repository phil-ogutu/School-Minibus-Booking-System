// import DashboardSidebar from "@/components/DashboardSidebar";

// export default function ManageBuses() {
//   return (
//     <div className="flex">
//       <DashboardSidebar />
//       <main className="flex-1 p-10">
//         <h1 className="text-2xl font-bold mb-4">Manage Buses</h1>
//         <p className="text-gray-600">
//           List of all buses with options to edit or delete.
//         </p>
//         {/* Implement table here later */}
//       </main>
//     </div>
//   );
// }

"use client";
// Manage Buses page
import React from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";

// Dummy data – replace with real fetch later
const buses = [
  { id: 1, numberPlate: "KDA 123A", capacity: 40, driver: "Peter Kamau" },
  { id: 2, numberPlate: "KDB 456B", capacity: 30, driver: "Mary Otieno" },
];

export default function ManageBuses() {
  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 p-10">
        <DashboardHeader title="Manage Buses" />

        <p className="text-gray-600 mb-4">
          List of all buses with options to edit or delete.
        </p>

        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Number Plate</th>
              <th className="px-4 py-2 border">Capacity</th>
              <th className="px-4 py-2 border">Driver</th>
            </tr>
          </thead>
          <tbody>
            {buses.map((bus) => (
              <tr key={bus.id}>
                <td className="border px-4 py-2">{bus.numberPlate}</td>
                <td className="border px-4 py-2">{bus.capacity}</td>
                <td className="border px-4 py-2">{bus.driver}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
