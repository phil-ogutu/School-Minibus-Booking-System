"use client";
import Button from "./Button";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-8 py-6 bg-white shadow-md">
      <h1 className="text-2xl font-bold text-green-600">SkoolaBus</h1>
      <div className="space-x-4">
        <Button href="/login">Sign up / Login</Button>
      </div>
    </nav>
  );
};

export default Navbar;
