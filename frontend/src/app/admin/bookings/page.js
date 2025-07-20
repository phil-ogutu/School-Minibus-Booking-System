"use client";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";

// dummy data
const bookings = [
  {
    id: 1,
    studentName: "John Doe",
    routeName: "Route A",
    busNumber: "KDA 123A",
    driver: { name: "Peter Kamau", phone: "+254 700 000 001" },
    pickupPoint: "CBD Stage",
    dropoffPoint: "Westlands School Gate",
    pickUpDate: "2024-07-22",
    dropOffDate: "2024-07-22",
    pickUpTime: "07:00",
    dropOffTime: "16:00",
    status: "Confirmed",
  },
  {
    id: 2,
    studentName: "Jane Smith",
    routeName: "Route B",
    busNumber: "KDB 456B",
    driver: { name: "Mary Otieno", phone: "+254 700 000 002" },
    pickupPoint: "Eastleigh Stop 5",
    dropoffPoint: "Karen School Gate",
    pickUpDate: "2024-07-22",
    dropOffDate: "2024-07-22",
    pickUpTime: "06:45",
    dropOffTime: "15:45",
    status: "Pending",
  },
];

export default function ViewBookings() {
  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 p-10">
        <DashboardHeader title="View Bookings" />

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border text-sm">
            <thead>
              <tr>
                <th className="px-3 py-2 border">Student</th>
                <th className="px-3 py-2 border">Route</th>
                <th className="px-3 py-2 border">Bus</th>
                <th className="px-3 py-2 border">Driver</th>
                <th className="px-3 py-2 border">Pickup</th>
                <th className="px-3 py-2 border">Drop-off</th>
                <th className="px-3 py-2 border">Date & Times</th>
                <th className="px-3 py-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td className="border px-3 py-2">{b.studentName}</td>
                  <td className="border px-3 py-2">{b.routeName}</td>
                  <td className="border px-3 py-2">{b.busNumber}</td>
                  <td className="border px-3 py-2">
                    {b.driver.name}
                    <br />
                    <span className="text-xs text-gray-500">
                      {b.driver.phone}
                    </span>
                  </td>
                  <td className="border px-3 py-2">{b.pickupPoint}</td>
                  <td className="border px-3 py-2">{b.dropoffPoint}</td>
                  <td className="border px-3 py-2">
                    <div>
                      PU: {b.pickUpDate} {b.pickUpTime}
                    </div>
                    <div>
                      DO: {b.dropOffDate} {b.dropOffTime}
                    </div>
                  </td>
                  <td className="border px-3 py-2">{b.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
