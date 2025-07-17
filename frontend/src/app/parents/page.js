"use client";

import DashboardSidebar from "@/components/DashboardSidebar";

export default function ParentDashboard() {
  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-6">Parent Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["My Children", "Upcoming Trips", "Live Tracking"].map((item) => (
            <div
              key={item}
              className="bg-white border rounded shadow p-6 text-center"
            >
              <p className="text-gray-500">{item}</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
