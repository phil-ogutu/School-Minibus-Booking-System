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
  FaUserTie,
} from "react-icons/fa";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: FaHome },
  { href: "/admin/parents", label: "Parents", icon: FaUserFriends },
  { href: "/admin/routes", label: "Routes", icon: FaRoute },
  { href: "/admin/buses", label: "Buses", icon: FaBus },
  { href: "/admin/bookings", label: "Bookings", icon: FaClipboardList },
  { href: "/admin/bus_owner", label: "Bus Owners", icon: FaUserCheck },
  { href: "/admin/drivers", label: "Drivers", icon: FaUserTie },
  { href: "/admin/profile", label: "Edit Profile", icon: FaUserFriends },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-base text-dark flex flex-col p-6 border-r border-slate-200">
      <h2 className="text-3xl font-bold mb-8 text-primary">SkoolaBus</h2>
      <nav className="flex flex-col space-y-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center space-x-2 px-3 py-2 my-2 rounded-md transition-colors duration-200 text-xl
                ${
                  isActive
                    ? "bg-primary text-white fw-bold"
                    : "hover:bg-tertiary hover:text-dark"
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
