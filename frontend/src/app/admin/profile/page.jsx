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
