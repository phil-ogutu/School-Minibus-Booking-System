"use client";

import { FiUsers, FiTrendingDown } from 'react-icons/fi';
import { useBuses } from "@/hooks/useBuses";
import { useBookings } from "@/hooks/useBookings";
import { useRoutes } from "@/hooks/useRoutes";
import { busIcon, groupIcon } from '@/components/ui/icons';

export default function AdminDashboard() {
  // dummy stats; replace with real API data later
    const { buses } = useBuses();
    const { bookings } = useBookings();
    const { routes } = useRoutes()

    console.log('mm', routes)
    
  const stats = [
    { label: "Total Parents", value: 45, icon: groupIcon('text-dark','text-4xl') },
    { label: "Total Buses", value:  buses && buses.length, icon: busIcon('text-dark','text-4xl') },
    // { label: "Total Routes", value: routes && routes.length },
    // { label: "Total Bookings", value: bookings && bookings.length},
    // { label: "Total Drivers", value: 12 },
  ];
  return (
    <main className="flex-1 p-10 bg-gray-50 min-h-screen">
      <WelcomeCard />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat) => (
          <AnalyticsCard key={stat.label} stat={stat}/>
        ))}
      </div>
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* {["Total Buses", "Total Routes", "Total Bookings"].map((item) => ( */}
        {/* // <div
        //   // key={item}
        //   key={stat.label}
        //   className="bg-white border rounded shadow p-6 text-center"
        // >
        //   <p className="text-gray-500">{stat.label}</p>
        //   <p className="text-2xl font-bold text-amber-500">{stat.value}</p>
        // </div> 
      </div> */}
    </main>
  );
}
const WelcomeCard = () => {
  return (
    <div
      className="w-full mx-auto rounded-xl flex items-center justify-between p-8 shadow-lg text-white mb-2"
      style={{
        background: 'linear-gradient(to right, #ff4b1f, #EAAA00)',
      }}
    >
      <div className="space-y-4 max-w-md">
        <h2 className="text-2xl sm:text-3xl font-semibold">
          Welcome back, <span className="inline-block">👋</span><br />
          <span className="text-white">Jaydon Frankie</span>
        </h2>
        <p className="text-white text-xl">
          "Success doesn’t come from what you do occasionally, it comes from what you do consistently."
        </p>
        {/* <button className="mt-4 px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md font-medium text-sm transition">
          Go now
        </button> */}
      </div>
    </div>
  );
};

const AnalyticsCard=({stat})=>{
  return(
    <div className="w-full my-2 h-36 bg-gradient-to-br from-tertiary to-base rounded-xl p-4 relative overflow-hidden text-dark shadow-sm">
      {/* Icon + Trend */}
      <div className="flex justify-between items-start">
        {stat?.icon}
        <div className="flex items-center text-sm text-dark">
          <FiTrendingDown className="mr-1 text-xs" />
          <span className="text-xs">-0.1%</span>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm text-dark">{stat?.label}</p>
        <h2 className="text-2xl font-bold text-dark">{stat?.value}</h2>
      </div>
    </div>
  )
}