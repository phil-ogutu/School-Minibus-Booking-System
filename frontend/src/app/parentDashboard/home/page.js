// app/parentDashboard/page.js
"use client";

import { useAuthContext } from "@/context/AuthContext";
import ParentDashboardSidebar from "@/components/ParentDashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import Container from "@/components/ui/Container";
import Text from "@/components/ui/Text";

export default function AdminDashboard() {
  // Access the user data from context
  const { user, loading, error } = useAuthContext();

  // Loading and error handling
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Count the number of bookings (if any)
  const totalBookings = user?.bookings?.length || 0; // Default to 0 if no bookings exist

  // Placeholder for Total Trips (will be updated later)
  const totalTrips = 0; // Placeholder for now

  return (
    <Container className="flex flex-col p-4 h-screen">
      <Container className='p-4' >
        <Text className='text-3xl mb-4'>Welcome Back, {user?.username ??'John'}</Text>
        <img src={'/banners/kids.jpg'} style={{width:'100%',height:'400px',objectFit:'cover',borderRadius:'10px'}}/>
      </Container>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["Total Bookings"].map((item) => (
          <div
            key={item}
            className="bg-white border rounded shadow p-6 text-center"
          >
            <p className="text-gray-500">{item}</p>
            <p className="text-2xl font-bold text-amber-500">{totalBookings}</p>
          </div>
        ))}

        {/* Total Trips */}
        {["Total Trips"].map((item) => (
          <div
            key={item}
            className="bg-white border rounded shadow p-6 text-center"
          >
            <p className="text-gray-500">{item}</p>
            <p className="text-2xl font-bold text-amber-500">{totalTrips}</p>
          </div>
        ))}
      </div>
    </Container>
  );
}