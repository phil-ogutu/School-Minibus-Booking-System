import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";

// Dummy data for bookings
const bookings = [
  {
    id: 1,
    studentName: "John Doe",
    route: "Route A",
    busNumber: "KDA 123A",
    pickupPoint: "Point 1",
    status: "Confirmed",
  },
  {
    id: 2,
    studentName: "Jane Smith",
    route: "Route B",
    busNumber: "KDB 456B",
    pickupPoint: "Point 5",
    status: "Pending",
  },
];

export default function ViewBookings() {
  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 p-10">
        <DashboardHeader title="View Bookings" />

        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Student Name</th>
              <th className="px-4 py-2 border">Route</th>
              <th className="px-4 py-2 border">Bus Number</th>
              <th className="px-4 py-2 border">Pickup Point</th>
              <th className="px-4 py-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="border px-4 py-2">{booking.studentName}</td>
                <td className="border px-4 py-2">{booking.route}</td>
                <td className="border px-4 py-2">{booking.busNumber}</td>
                <td className="border px-4 py-2">{booking.pickupPoint}</td>
                <td className="border px-4 py-2">{booking.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
