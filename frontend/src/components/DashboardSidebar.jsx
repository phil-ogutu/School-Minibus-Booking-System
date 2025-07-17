"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

export default function DashboardSidebar() {
  return (
    <aside className="w-64 h-screen bg-yellow-500 text-white flex flex-col p-6">
      <h2 className="text-2xl font-bold mb-8">SkoolaBus</h2>

      <nav className="space-y-4">
        <Link href="/admin">Dashboard</Link>
        <Link href="/admin/buses">Manage Buses</Link>
        <Link href="/admin/routes">Manage Routes</Link>
        <Link href="/admin/bookings">View Bookings</Link>
        <Link href="/admin/parents">Parents & Children</Link>
      </nav>

      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="mt-auto bg-red-600 hover:bg-red-700 rounded px-4 py-2"
      >
        Logout
      </button>
    </aside>
  );
}
