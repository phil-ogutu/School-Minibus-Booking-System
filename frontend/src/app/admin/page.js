// "use client";

// import DashboardSidebar from "@/components/DashboardSidebar";
// import DashboardHeader from "@/components/DashboardHeader";

// export default function AdminDashboard() {
//   return (
//     <div className="flex">
//       <DashboardSidebar />
//       <main className="flex-1 p-10">
//         <DashboardHeader title="Admin Dashboard" />

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {["Total Buses", "Total Routes", "Total Bookings"].map((item) => (
//             <div
//               key={item}
//               className="bg-white border rounded shadow p-6 text-center"
//             >
//               <p className="text-gray-500">{item}</p>
//               <p className="text-2xl font-bold">0</p>
//             </div>
//           ))}
//         </div>
//       </main>
//     </div>
//   );
// }
// // This is the main entry point for the admin dashboard page
// // It includes the sidebar and header components, setting up the layout for the admin dashboard.

// app/admin/bookings/page.js
"use client";

import { FiUsers, FiTrendingDown } from "react-icons/fi";
import { busIcon, groupIcon, routeIcon } from "@/components/ui/icons";
import { useFetch } from "@/hooks/useFetch";
import ViewBookings from "@/components/ViewBookings"; // clean and focused

export default function AdminDashboard() {
  const { data: stats } = useFetch("/api/analytics");
  return (
    <main className="flex-1 p-10 bg-gray-50 min-h-screen">
      <WelcomeCard />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats?.map((stat, idx) => (
          <AnalyticsCard key={idx} stat={stat} />
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
        background: "linear-gradient(to right, #ff4b1f, #EAAA00)",
      }}
    >
      <div className="space-y-4 max-w-md">
        <h2 className="text-2xl sm:text-3xl font-semibold">
          Welcome back, <span className="inline-block">👋</span>
          <br />
          <span className="text-white">Jaydon Frankie</span>
        </h2>
        <p className="text-white text-xl">
          "Success doesn’t come from what you do occasionally, it comes from
          what you do consistently."
        </p>
        {/* <button className="mt-4 px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md font-medium text-sm transition">
          Go now
        </button> */}
      </div>
    </div>
  );
};

const AnalyticsCard = ({ stat }) => {
  const statLabel = {
    parent: {
      icon: groupIcon("text-dark", "text-4xl"),
      label: "Total Parents",
    },
    route: { icon: routeIcon("text-dark", "text-4xl"), label: "Total Routes" },
  };
  return (
    <div className="w-full my-2 h-36 bg-gradient-to-br from-tertiary to-base rounded-xl p-4 relative overflow-hidden text-dark shadow-sm">
      {/* Icon + Trend */}
      <div className="flex justify-between items-start">
        {statLabel[stat?.label]["icon"]}
        <div className="flex items-center text-sm text-dark">
          <FiTrendingDown className="mr-1 text-xs" />
          <span className="text-xs">-0.1%</span>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm text-dark">{statLabel[stat?.label]["label"]}</p>
        <h2 className="text-2xl font-bold text-dark">{stat?.count}</h2>
      </div>
    </div>
  );
};
