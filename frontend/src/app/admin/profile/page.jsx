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

// src/app/admin/profile/page.jsx
"use client";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import ProfileForm from "@/components/ProfileForm";

export default function EditProfilePage() {
  // fake data so the form renders instantly
  const fallback = {
    name: "Admin User",
    email: "admin@skoolabus.com",
    mobile: "+254700000000",
    photo_url: "/fallback-avatar.png",
  };

  const dummySave = async (formData) => {
    // pretend we saved
    console.log("would save:", Object.fromEntries(formData));
    alert("Saved (fake)!");
  };

  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 p-10">
        <DashboardHeader title="Edit Profile" />
        <ProfileForm initial={fallback} onSave={dummySave} />
      </main>
    </div>
  );
}
