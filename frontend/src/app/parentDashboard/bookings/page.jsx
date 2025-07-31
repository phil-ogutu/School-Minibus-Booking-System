// parentDashboard/bookings/page.js
"use client";

import React, { useState } from "react";
import ParentDashboardSidebar from "@/components/ParentDashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import BookingTable from "@/components/BookingTable";
import { useAuthContext } from "@/context/AuthContext";
import axiosInstance from "@/lib/api"; // axios instance for the API calls
import EditBookingModal from "@/components/EditBookingModal";
import Container from "@/components/ui/Container";
import Text from "@/components/ui/Text";
import { addIcon, deleteIcon, editIcon } from "@/components/ui/icons";
import DataTable from "@/components/DataTable";
import { useFetch } from "@/hooks/useFetch";
import { useRouter } from "next/navigation";

export default function ParentDashboard() {
  const { user, checkAuth } = useAuthContext();// checkAuth
  if (!user) {
    checkAuth()
  };
  const { data: bookings } = useFetch(`/api/bookings?parent=${user && user?.id}`)
  const [isEditing, setIsEditing] = useState(false); // Manage modal state
  const [editBookingData, setEditBookingData] = useState(null); // Track booking data being edited
  console.log(bookings);
  const router = useRouter()

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
  const columns = [
    { header: "Student", accessor: "child_name" },
    { header: "Bus", accessor: "bus?.plate ",render: ((booking) => (`${booking?.bus?.plate}`)) },
    { header: "Pickup", accessor: "pickup" },
    { header: "Drop-off", accessor: "dropoff" },
    { header: "Price", accessor: "price" },
    { header: "Status", accessor: "status", render: (status) => status ? 'Active' : 'Inactive' },
    {
      header: "Actions",
      accessor: "actions",
      render: (id, row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => router.push(`/track?id=${id?.id}`)}
            className="bg-tertiary text-dark p-1 rounded hover:bg-secondary flex flex-row gap-2 align-middle"
          >
            track
          </button>
          <button
            // onClick={() => handleShowUpdateModal(id)}
            className="bg-tertiary text-dark p-1 rounded hover:bg-secondary flex flex-row gap-2 align-middle"
          >
            {editIcon('my-0','text-xl')}
            edit
          </button>
          <button
            // onClick={() => handleShowDeleteModal(id)}
            className="bg-red-400 text-white p-1 rounded hover:bg-red-600 flex flex-row gap-2 align-middle text-md"
          >
            {deleteIcon('my-0','text-xl')}
            delete
          </button>
        </div>
      ),
    },
  ];

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-gray-600">Loading...</span>
      </div>
    );
  }

  return (
    <Container className="flex flex-col p-4 h-screen">
        <Container className="flex flex-row justify-between align-middle">
          <Text className='text-4xl fw-bold' as='h1'>Bookings</Text>
          <Container className="flex flex-row gap-2">
            <input 
              type="search" 
              placeholder="search bookings" 
              className="block min-w-0 grow py-1.5 pr-3 pl-1 bg-tertiary border-dark rounded-md text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
              // onChange={((e)=>{handleSearch(e)})}
            />
            <button 
              className="bg-primary p-2 rounded-md text-white flex-row flex align-middle text-lg cursor-pointer" 
              type="button"
              // onClick={()=>openModal()}
            >{addIcon('','',{marginTop:4})}new</button>
          </Container>
        </Container>
      <DataTable columns={columns} data={bookings ?? []}/>
    </Container>
    // <div className="flex">
    //   <ParentDashboardSidebar />
    //   <main className="flex-1 p-10">
    //     <DashboardHeader title="Your Bookings" />
    //     <p className="text-gray-600 mb-4">
    //       Manage your bookings below. You can edit, cancel, or subscribe to future terms.
    //     </p>
    //     <BookingTable
    //       bookings={bookings}
    //       onEdit={handleEditBooking}
    //       onDelete={handleDeleteBooking}
    //     />
        
    //     {isEditing && (
    //       <EditBookingModal
    //         booking={editBookingData} // Pass the entire booking data to the modal
    //         onClose={() => setIsEditing(false)}
    //         onSave={handleSaveBooking}
    //       />
    //     )}
    //   </main>
    // </div>
  );
}