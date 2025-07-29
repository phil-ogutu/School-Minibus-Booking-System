"use client";
import { useAuthContext } from "@/context/AuthContext";
import Button from "./Button";
import { usePathname,useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false);
  const { user, setUser, loading, checkAuth } = useAuthContext();
  const { logout } = useAuth()

  console.log(user);
  const linkClasses = (path) =>
    `block py-2 px-3 rounded-sm md:p-0 ${
      pathname === path
        ? "text-white bg-yellow-500 md:bg-transparent md:text-yellow-600"
        : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-yellow-600"
    }`;
  const handleLogout=()=>{
    logout().then(()=>{
      router.push("/");
    })
  }
  return (
    <nav className="bg-white w-full border-b border-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <span className="self-center text-2xl font-semibold whitespace-nowrap">
            SkoolaBus
          </span>
        </a>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse align-middle">
          {user && (
            <div className="flex flex-row align-middle gap-2">
              <button className="p-2 bg-dark h-12 rounded-md text-white my-auto" onClick={(()=>{handleLogout()})}>Logout</button>
              <ProfileCard name={user?.username} email={user?.email}/>
            </div>
          )}
          {!user && (
            <Button
              href="/login"
              type="button"
              size="base"
            >
              Login | Sign Up
            </Button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="navbar-sticky"
            aria-expanded={isOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          className={`items-center justify-between w-full md:flex md:w-auto md:order-1
          ${isOpen ? "block" : "hidden"}`}
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 md:text-xl font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white">
            <li>
              <a
                href="/"
                className={linkClasses("/")}
                aria-current="page"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/bookings"
                className={linkClasses("/bookings")}              >
                Find Bus
              </a>
            </li>
            <li>
              <a 
                href="/track"
                className={linkClasses("/track")}
              >
                Track
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

const ProfileCard = ({ name = 'User', email = 'user@example.com' }) => {
  const initial = name.charAt(0).toUpperCase();

  const getRandomBgColor = () => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
      'bg-indigo-500', 'bg-pink-500', 'bg-purple-500', 'bg-teal-500',
      'bg-orange-500', 'bg-cyan-500'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  const bgColor = useMemo(() => getRandomBgColor(), []);
  return (
    <div className="flex items-center space-x-4 p-4 bg-white align-middle">
      <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${bgColor}`}>
        {initial}
      </div>
      {/* <div>
        <div className="font-semibold text-gray-800">{name}</div>
        <div className="text-sm text-gray-500">{email}</div>
      </div> */}
    </div>
  );
};