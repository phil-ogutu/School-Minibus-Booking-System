// components/DashboardHeader.jsx
"use client";

// import { useSession } from "next-auth/react";
import { IoPerson } from "react-icons/io5";// Single person icon
import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";

export default function DashboardHeader({ title }) {
  // const { data: session } = useSession();
  // const user = session?.user;
  const [isImageValid, setIsImageValid] = useState(false);
  const { user, fetchUser } = useUser(); // fetchUser
  
  // Just to speed up image fallback
  useEffect(() => {
    if (user?.photo_url) {
      const img = new Image();
      img.src = user.photo_url;
      img.onload = () => setIsImageValid(true);
      img.onerror = () => setIsImageValid(false);
    }
  }, [user?.photo_url]);

  return (
    <header className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-[#0F333F]">{title}</h1>

      <div className="flex items-center space-x-3">
        {/* <span className="text-gray-700">{user?.name || "Admin"}</span> */}
        {/* <img
          src={{user?.image ||} "/fallback-avatar.png"}
          alt="avatar"
          className="w-10 h-10 rounded-full border"
        /> */}
        {isImageValid ? (
          <img
            src={user.photo_url}
            alt="Avatar"
            className="w-10 h-10 rounded-full border"
            onError={() => setImgError(true)}
          />
          ) : (
            <IoPerson className="w-10 h-10 rounded-full border text-gray-500 bg-gray-200 p-1" />
        )}
      </div>
    </header>
  );
}
