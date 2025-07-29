// components/EditBookingModal.js
"use client";

import React, { useState, useEffect } from "react";

const EditBookingModal = ({ booking, onClose, onSave }) => {
  const [formData, setFormData] = useState({});

  // Populate form with the booking data when the modal is opened
  useEffect(() => {
    if (booking) {
      // Ensure that parent_id is handled separately (while populate the form with booking details)
      setFormData({
        ...booking,
        parent_id: booking?.parent?.id || booking.parent_id, // Ensure we get parent_id from parent object or booking
      });
    }
  }, [booking]); // This will re-run when the booking changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Make sure to send the updated formData with parent_id correctly (specify the fiels needed - those in the form below because booking is deeply nested)
    const updatedBooking = {
      "child_name": formData.child_name,
      "pickup": formData.pickup,
      "dropoff": formData.dropoff,
      "price": formData.price,
      "id": formData.id,
      parent_id: formData.parent_id || formData?.parent?.id, // Ensure parent_id is sent as a separate field
    };

    // console.log("FORMDATA", updatedBooking);
    onSave(updatedBooking); // Save the updated booking data
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold">Edit Booking</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="child_name" className="block text-sm font-medium text-gray-700">
              Child Name
            </label>
            <input
              type="text"
              id="child_name"
              name="child_name"
              value={formData.child_name || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="pickup" className="block text-sm font-medium text-gray-700">
              Pickup Location
            </label>
            <input
              type="text"
              id="pickup"
              name="pickup"
              value={formData.pickup || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="dropoff" className="block text-sm font-medium text-gray-700">
              Dropoff Location
            </label>
            <input
              type="text"
              id="dropoff"
              name="dropoff"
              value={formData.dropoff || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex justify-between items-center mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookingModal;

// modal where users can edit their booking details. When they submit the form, it will trigger the handleSaveBooking function. (ParentDashboard/bookings/page.js)