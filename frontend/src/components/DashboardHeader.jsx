// "use client";

// import { useSession } from "next-auth/react";

// export default function DashboardHeader({ title }) {
//   const { data: session } = useSession();
//   const user = session?.user;

//   return (
//     <header className="flex justify-between items-center mb-6">
//       <h1 className="text-3xl font-bold">{title}</h1>

//       <div className="flex items-center space-x-3">
//         <span className="text-gray-700">{user?.name || "User"}</span>
//         <img
//           src={user?.image || "/fallback-avatar.png"}
//           alt="avatar"
//           className="w-10 h-10 rounded-full border"
//         />
//       </div>
//     </header>
//   );
// }

// // components/DashboardHeader.jsx
// "use client";

// // import { useSession } from "next-auth/react";
// import { IoPerson } from "react-icons/io5";// Single person icon
// import { useState, useEffect } from "react";
// import { useAuthContext } from "@/context/AuthContext";

// export default function DashboardHeader({ title }) {
//   // const { data: session } = useSession();
//   // const user = session?.user;
//   const [isImageValid, setIsImageValid] = useState(false);
//   const { user, loading } = useAuthContext(); // Destructure user and loading // fetchUser
  
//   // Just to speed up image fallback
//   useEffect(() => {
//     if (user?.photo_url) {
//       const img = new Image();
//       img.src = user.photo_url;
//       img.onload = () => setIsImageValid(true);
//       img.onerror = () => setIsImageValid(false);
//     }
//   }, [user?.photo_url]);

//   return (
//     <header className="flex justify-between items-center mb-6">
//       <h1 className="text-3xl font-bold text-[#0F333F]">{title}</h1>

//       <div className="flex items-center space-x-3">
//         <span className="text-gray-700">{user?.name || "Admin"}</span>
//         {/* <img
//           src={{user?.image ||} "/fallback-avatar.png"}
//           alt="avatar"
//           className="w-10 h-10 rounded-full border"
//         /> */}
//         {isImageValid ? (
//           <img
//             src={user.photo_url}
//             alt="Avatar"
//             className="w-10 h-10 rounded-full border"
//             onError={() => setImgError(true)}
//           />
//           ) : (
//             <IoPerson className="w-10 h-10 rounded-full border text-gray-500 bg-gray-200 p-1" />
//         )}
//       </div>
//     </header>
//   );
// }
"use client";

import { IoPerson } from "react-icons/io5"; // Person icon
import { useState, useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";

export default function DashboardHeader({ title }) {
  const [isImageValid, setIsImageValid] = useState(false);
  const { user, loading } = useAuthContext(); // Fetching user data from AuthContext

  // Check if the user's photo URL is valid or not
  useEffect(() => {
    if (user?.photo_url) {
      const img = new Image();
      img.src = user.photo_url;
      img.onload = () => setIsImageValid(true);  // Image loaded successfully
      img.onerror = () => setIsImageValid(false); // Image failed to load
    }
  }, [user?.photo_url]);

  const getAvatar = () => {
    if (isImageValid && user?.photo_url) {
      return (
        <img
          src={user.photo_url}
          alt="Avatar"
          className="w-10 h-10 rounded-full border-2 border-[#0F333F]"
        />
      );
    }

    // If there's no valid photo or URL, show the IoPerson icon with conditional styling
    const iconBackgroundColor = user?.photo_url ? "bg-transparent" : "bg-gray-300"; // If no photo URL, background color is gray
    const borderColor = user?.photo_url ? "border-[#0F333F]" : "border-gray-400"; // If no photo, border is lighter

    return (
      <IoPerson
        className={`w-10 h-10 rounded-full ${iconBackgroundColor} ${borderColor} text-gray-500 p-1`}
      />
    );
  };

  return (
    <header className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-[#0F333F]">{title}</h1>

      <div className="flex items-center space-x-3">
        <span className="text-gray-700">{user?.name || "Admin"}</span>
        {getAvatar()}
      </div>
    </header>
  );
}

// Only users whose user.role === 'admin' can access this page
// the DashboardHeader is reusable but independent of any other file
