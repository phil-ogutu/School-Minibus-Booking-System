"use client";

import { useState } from 'react';
import { useBookings } from '@/hooks/useBookings';
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import CreateBooking from "@/components/CreateBooking";
import UpdateBookingForm from '@/components/UpdateBooking';
import DataTable from "@/components/DataTable"; // Import DataTable

const ViewBookings = () => {
  const { bookings, deleteExistingBooking } = useBookings();
  const [allowEditing, setAllowEditng] = useState(false)
  const [editingBookingId, setEditingBookingId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateBooking = () => {
    setIsCreating(true);
  };

  const handleEdit = (bookingId) => {
    setAllowEditng(true)
    if (bookingId) {
      setEditingBookingId(bookingId);
    }
  };

  const handleDelete = async (bookingId) => {
    const confirmation = window.confirm('Are you sure you want to delete this booking?');
    if (confirmation) {
      await deleteExistingBooking(bookingId);
    }
  };

  const handleCloseModal = () => {
    setIsCreating(false);
    setEditingBookingId(null);
  };

  const columns = [
    { header: "Student", accessor: "child_name" },
    { header: "Parent", accessor: "parent_id" },
    { header: "Bus", accessor: "bus_id" },
    { header: "Title", accessor: "title" },
    { header: "Pickup", accessor: "pickup" },
    { header: "Drop-off", accessor: "dropoff" },
    { header: "Price", accessor: "price" },
    { header: "Status", accessor: "status", render: (status) => status ? 'Active' : 'Inactive' },
    { header: "Created", accessor: "created_at" },
    { header: "Updated", accessor: "updated_at" },
    { header: "Actions", accessor: "actions" },
  ];

  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 p-10 bg-gray-50 min-h-screen">
        <DashboardHeader title="View Bookings" />

        {/* Create New Booking Button */}
        <button
          onClick={handleCreateBooking}
          className="bg-blue-500 text-white p-2 rounded mb-4"
        >
          Create New Booking
        </button>

        {/* Render the CreateBooking component if isCreating is true */}
        {isCreating && <CreateBooking onClose={handleCloseModal} />}

        {/* Conditionally render the UpdateBookingForm */}
        {allowEditing && (
          <UpdateBookingForm
            bookingId={editingBookingId}
            onClose={handleCloseModal}
          />
        )}

        {/* DataTable component */}
        <DataTable
          columns={columns}
          data={bookings}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
};

export default ViewBookings;

