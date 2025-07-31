"use client";

import { FiUsers, FiTrendingDown } from 'react-icons/fi';
import { bookingIcon, busIcon, groupIcon, mapPinIcon, routeIcon } from '@/components/ui/icons';
import { useFetch } from '@/hooks/useFetch';

export default function AdminDashboard() {
  const {data: stats } = useFetch('/api/analytics');
  return (
    <main className="flex-1 p-10 bg-gray-50 min-h-screen">
      <WelcomeCard />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats?.map((stat,idx) => (
          <AnalyticsCard key={idx} stat={stat}/>
        ))}
      </div>
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
  const statLabel={
    parent:{ icon: groupIcon('text-dark','text-4xl'), label: 'Total Parents'},
    route:{ icon: routeIcon('text-dark','text-4xl'), label: 'Total Routes'},
    buses:{ icon: busIcon('text-dark','text-4xl'), label: 'Total Buses'},
    bookings:{ icon: bookingIcon('text-dark','text-4xl'), label: 'Total Bookings'},
    locations:{ icon: mapPinIcon('text-dark','text-4xl'), label: 'Total Locations'}
  }
  return(
    <div className="w-full my-2 h-36 bg-gradient-to-br from-tertiary to-base rounded-xl p-4 relative overflow-hidden text-dark shadow-sm">
      {/* Icon + Trend */}
      <div className="flex justify-between items-start">
        {statLabel[stat?.label]['icon']}
        <div className="flex items-center text-sm text-dark">
          <FiTrendingDown className="mr-1 text-xs" />
          <span className="text-xs">-0.1%</span>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm text-dark">{statLabel[stat?.label]['label']}</p>
        <h2 className="text-2xl font-bold text-dark">{stat?.count}</h2>
      </div>
    </div>
  )
}