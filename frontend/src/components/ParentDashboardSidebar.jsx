"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  FaUserFriends,
  FaHome,
  FaSignOutAlt,
  FaClipboardList,
} from "react-icons/fa";

const navItems = [
  { href: "/parentDashboard", label: "Dashboard", icon: FaHome },
  { href: "/parentDashboard/bookings", label: "View Bookings", icon: FaClipboardList },
  { href: "/parentDashboard/profile", label: "Edit Profile", icon: FaUserFriends },
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