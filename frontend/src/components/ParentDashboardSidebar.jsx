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
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { href: "/parentDashboard/home", label: "Dashboard", icon: FaHome },
  { href: "/parentDashboard/bookings", label: "Bookings", icon: FaClipboardList },
  { href: "/parentDashboard/profile", label: "Profile", icon: FaUserFriends },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth(); 

  return (
    <aside className="w-64 h-screen bg-base text-dark flex flex-col p-6 border-r border-slate-200">
      <Link
        href={'/'}
      >
        <h2 className="text-3xl font-bold mb-8 text-primary cursor-pointer">SkoolaBus</h2>
      </Link>
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
        onClick={() => logout()}
        className="mt-auto bg-dark text-white rounded px-4 py-2 flex items-center justify-center space-x-2 cursor-pointer"
      >
        <FaSignOutAlt /> <span>Logout</span>
      </button>
    </aside>
  );
}