// parentDashboard/bookings/page.js
"use client";

import React, { useState } from "react";
import ParentDashboardSidebar from "@/components/ParentDashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import BookingTable from "@/components/BookingTable";
import { useAuthContext } from "@/context/AuthContext";
import axiosInstance from "@/lib/api"; // axios instance for the API calls
import EditBookingModal from "@/components/EditBookingModal";

export default function ParentDashboard() {
  const { user, checkAuth } = useAuthContext();// checkAuth
  const bookings = user?.bookings || []; // Get bookings from user context
  const [isEditing, setIsEditing] = useState(false); // Manage modal state
  const [editBookingData, setEditBookingData] = useState(null); // Track booking data being edited
    if (user) {
    console.log('USER ID: ', user.id)
  }

  const handleDeleteBooking = async (bookingId) => {
    console.log('BOOKING ID: ', bookingId)
    try {
      const response = await axiosInstance.delete(`/bookings/${bookingId}`);
      if (response.status === 200) {
        alert("Booking deleted successfully");
        checkAuth(); // Refetch bookings after deletion
      }
    } catch (error) {
      alert("Error deleting booking");
      console.error("Error deleting booking:", error);
    }
  };

  const handleEditBooking = async (bookingId) => {
    try {
      const response = await axiosInstance.get(`/bookings/${bookingId}`);
      setEditBookingData(response.data); // Set the full booking data (while passing to onsave in EditBookingModal only provide field edited because its deeply nested)
      setIsEditing(true); // Show the modal
    } catch (error) {
      alert("Error fetching booking data");
      console.error("Error fetching booking data:", error);
    }
  };

  const handleSaveBooking = async (updatedBookingDetails) => {
    try {
      const response = await axiosInstance.patch(`/bookings/${updatedBookingDetails.id}`, updatedBookingDetails);
      if (response.status === 200) {
        alert("Booking updated successfully");
        setIsEditing(false); // Close modal
        checkAuth(); // Refetch bookings to update UI
      }
    } catch (error) {
      alert("Error updating booking");
      console.error("Error updating booking:", error);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-gray-600">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex">
      <ParentDashboardSidebar />
      <main className="flex-1 p-10">
        <DashboardHeader title="Your Bookings" />
        <p className="text-gray-600 mb-4">
          Manage your bookings below. You can edit, cancel, or subscribe to future terms.
        </p>
        <BookingTable
          bookings={bookings}
          onEdit={handleEditBooking}
          onDelete={handleDeleteBooking}
        />
        
        {isEditing && (
          <EditBookingModal
            booking={editBookingData} // Pass the entire booking data to the modal
            onClose={() => setIsEditing(false)}
            onSave={handleSaveBooking}
          />
        )}
      </main>
    </div>
  );
}