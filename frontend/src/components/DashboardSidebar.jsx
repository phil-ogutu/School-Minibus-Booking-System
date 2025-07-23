// "use client";

// import Link from "next/link";
// import { signOut } from "next-auth/react";

// export default function DashboardSidebar() {
//   return (
//     <aside className="w-64 h-screen bg-yellow-500 text-white flex flex-col p-6">
//       <h2 className="text-4xl font-bold mb-8">SkoolaBus</h2>

//       <nav className="space-y-4">
//         <Link href="/admin">Dashboard</Link>
//         <Link href="/admin/buses">Manage Buses</Link>
//         <Link href="/admin/routes">Manage Routes</Link>
//         <Link href="/admin/bookings">View Bookings</Link>
//         <Link href="/admin/parents">Parents & Children</Link>
//       </nav>

//       <button
//         onClick={() => signOut({ callbackUrl: "/" })}
//         className="mt-auto bg-red-600 hover:bg-red-700 rounded px-4 py-2"
//       >
//         Logout
//       </button>
//     </aside>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  FaBus,
  FaRoute,
  FaUserFriends,
  FaHome,
  FaSignOutAlt,
  FaClipboardList,
  FaUserCheck,
} from "react-icons/fa";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: FaHome },
  { href: "/admin/buses", label: "Manage Buses", icon: FaBus },
  { href: "/admin/bus-ownership", label: "Bus Ownership", icon: FaUserCheck },
  { href: "/admin/routes", label: "Manage Routes", icon: FaRoute },
  { href: "/admin/bookings", label: "View Bookings", icon: FaClipboardList },
  { href: "/admin/parents", label: "Parents", icon: FaUserFriends },
  { href: "/admin/profile", label: "Edit Profile", icon: FaUserFriends },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-[#0F333F] text-white flex flex-col p-6">
      <h2 className="text-3xl font-bold mb-8">SkoolaBus</h2>

      <nav className="flex flex-col space-y-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors duration-200
                ${
                  isActive
                    ? "bg-[#0A252F] text-amber-400"
                    : "hover:bg-[#0A252F] hover:text-amber-400"
                }`}
            >
              <Icon /> <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="mt-auto bg-red-600 hover:bg-red-700 rounded px-4 py-2 flex items-center justify-center space-x-2"
      >
        <FaSignOutAlt /> <span>Logout</span>
      </button>
    </aside>
  );
}
