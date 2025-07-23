// src/app/parentDashboard/profile/page.jsx
"use client";
import { useUser } from "@/context/UserContext";
import ParentDashboardSidebar from "@/components/ParentDashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import ProfileForm from "@/components/ProfileForm";
import axiosInstance from "@/lib/api"; // Axios for the components' API requests

export default function EditProfilePage() {
  const { user, setUser, loading, error, fetchUser } = useUser();

  if (loading) return <div>Loading...</div>; 
  if (error) return <div>Error: {error}</div>; 

  const fallback = {
    name: user?.username || "Parent User",
    email: user?.email || "parent@gmail.com",
    mobile: user?.mobile || "+254700000000",
    photo_url: user?.photo_url || "/fallback-avatar.png",
  };

  // Function to handle saving the profile updates
  const handleSave = async (formData) => {
    const updatedData = Object.fromEntries(formData);
    console.log("Updating profile with:", updatedData);

    try {
      // Send the updated data to the backend (PATCH request)
      const response = await axiosInstance.patch(`/users/${user.id}`, updatedData);
      console.log('RESPONSE :', response)
      console.log('USER ID :', user.id)
      
      // On success, update the context with the new data
      setUser((prevUser) => ({
        ...prevUser,
        ...updatedData, // Update user context with the new data
      }));

      alert("Profile updated successfully!");

      // Optionally, call `fetchUser` again to make sure you get any updated data from the backend
      // fetchUser(); // Uncomment if you want to refetch user data from the server

    } catch (err) {
      alert("Error updating profile.");
      console.error("Error updating profile:", err);
    }
  };

  return (
    <div className="flex">
      <ParentDashboardSidebar />
      <main className="flex-1 p-10">
        <DashboardHeader title="Edit Profile" />
        <ProfileForm initial={fallback} onSave={handleSave} />
      </main>
    </div>
  );
}
