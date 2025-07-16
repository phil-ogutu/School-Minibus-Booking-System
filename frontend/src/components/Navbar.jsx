// src/components/Navbar.jsx
"use client";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-8 py-6 bg-white shadow-md">
      <h1 className="text-2xl font-bold text-green-600">SkoolaBus</h1>
      <div className="space-x-4">
        <Link href="/login">
          <button className="bg-green-600 text-white px-4 py-2 rounded">
            Sign up / Login
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
