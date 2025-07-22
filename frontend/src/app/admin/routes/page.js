import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";

// Dummy data for routes
const routes = [
  {
    id: 1,
    name: "Route A",
    pickupPoints: ["Point 1", "Point 2", "Point 3"],
    busNumber: "KDA 123A",
  },
  {
    id: 2,
    name: "Route B",
    pickupPoints: ["Point 4", "Point 5"],
    busNumber: "KDB 456B",
  },
];

export default function ManageRoutes() {
  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 p-10">
        <DashboardHeader title="Manage Routes" />

        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Route Name</th>
              <th className="px-4 py-2 border">Pickup Points</th>
              <th className="px-4 py-2 border">Bus Number</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((route) => (
              <tr key={route.id}>
                <td className="border px-4 py-2">{route.name}</td>
                <td className="border px-4 py-2">
                  {route.pickupPoints.join(", ")}
                </td>
                <td className="border px-4 py-2">{route.busNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
