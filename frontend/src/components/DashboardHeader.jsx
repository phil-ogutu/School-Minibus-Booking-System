"use client";

import { useSession } from "next-auth/react";

export default function DashboardHeader({ title }) {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <header className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">{title}</h1>

      <div className="flex items-center space-x-3">
        <span className="text-gray-700">{user?.name || "User"}</span>
        <img
          src={user?.image || "/fallback-avatar.png"}
          alt="avatar"
          className="w-10 h-10 rounded-full border"
        />
      </div>
    </header>
  );
}
