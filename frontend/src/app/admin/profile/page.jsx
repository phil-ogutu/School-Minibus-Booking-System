// "use client";
// import { useSession } from "next-auth/react";
// import { useEffect, useState } from "react";
// import DashboardSidebar from "@/components/DashboardSidebar";
// import DashboardHeader from "@/components/DashboardHeader";
// import ProfileForm from "@/components/ProfileForm";

// export default function EditProfilePage() {
//   const { data: session, update } = useSession();
//   const [initial, setInitial] = useState(null);

//   useEffect(() => {
//     fetch("/api/users/me")
//       .then((r) => r.json())
//       .then(setInitial);
//   }, []);

//   if (!initial) return <p className="p-10">Loading…</p>;

//   const handleSave = async (formData) => {
//     const res = await fetch("/api/users/me", { method: "PUT", body: formData });
//     if (res.ok) {
//       await update(); // refresh NextAuth session
//       alert("Saved!");
//     }
//   };

//   return (
//     <div className="flex">
//       <DashboardSidebar />
//       <main className="flex-1 p-10">
//         <DashboardHeader title="Edit Profile" />
//         <ProfileForm initial={initial} onSave={handleSave} />
//       </main>
//     </div>
//   );
// }

// // src/app/admin/profile/page.jsx
// "use client";
// import DashboardSidebar from "@/components/DashboardSidebar";
// import DashboardHeader from "@/components/DashboardHeader";
// import ProfileForm from "@/components/ProfileForm";

// export default function EditProfilePage() {
//   // fake data so the form renders instantly
//   const fallback = {
//     name: "Admin User",
//     email: "admin@skoolabus.com",
//     mobile: "+254700000000",
//     photo_url: "/fallback-avatar.png",
//   };

//   const dummySave = async (formData) => {
//     // pretend we saved
//     console.log("would save:", Object.fromEntries(formData));
//     alert("Saved (fake)!");
//   };

//   return (
//     <div className="flex">
//       <DashboardSidebar />
//       <main className="flex-1 p-10">
//         <DashboardHeader title="Edit Profile" />
//         <ProfileForm initial={fallback} onSave={dummySave} />
//       </main>
//     </div>
//   );
// }

// src/app/admin/profile/page.jsx
"use client";
import { useAuthContext } from "@/context/AuthContext";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import ProfileForm from "@/components/ProfileForm";
import axiosInstance from "@/lib/api"; // Axios for the components' API requests

export default function EditProfilePage() {
  const { user, setUser, loading, checkAuth } = useAuthContext() // error?
  console.log('PROFILE USER', user)

  if (loading) return <div>Loading...</div>; 
  // if (error) return <div>Error: {error}</div>; 

  const fallback = {
    name: user?.username || "Admin User",
    email: user?.email || "admin@gmail.com",
    mobile: user?.mobile || "+254700000000",
    photo_url: user?.photo_url || "/fallback-avatar.png",
  };

  // Function to handle saving the profile updates
  const handleSave = async (formData) => {
    const updatedData = Object.fromEntries(formData);
    console.log("Updating profile with:", updatedData);
    if (!user || !user.id) {
      alert("You're not logged in! Pleade log in to update profile.");
      return
    }
    // console.log('profile user id: ', user.id)

    try {
      // Send the updated data to the backend (PATCH request)
      const response = await axiosInstance.patch(`/users/${user.id}`, updatedData);
      // console.log('RESPONSE :', response)
      // console.log('USER ID :', user.id)
      
      // On success, update the context with the new data
      setUser((prevUser) => ({
        ...prevUser,
        ...updatedData, // Update user context with the new data
      }));

      alert("Profile updated successfully!");

      // Optionally, call `checkAuth` again to make sure you get any updated data from the backend
      // checkAuth(); // Uncomment if you want to refetch user data from the server

    } catch (err) {
      alert("Error updating profile.");
      console.error("Error updating profile:", err);
    }
  };

  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 p-10">
        <DashboardHeader title="Edit Profile" />
        <ProfileForm initial={fallback} onSave={handleSave} />
      </main>
    </div>
  );
}