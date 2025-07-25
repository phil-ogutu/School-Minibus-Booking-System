"use client";
import React from "react";
import { createPortal } from "react-dom";
import { useState } from "react";
import { useBookings } from "@/hooks/useBookings";
import { useMutation } from "@/hooks/useMutation";
import { useAuthContext } from "@/context/AuthContext";

const BookBusModal = ({ isOpen, onClose, route, bus }) => {
  if (!isOpen || !route || !bus) return null;

  const { user } = useAuthContext();
  const { creatingBooking } = useBookings();

  const { mutate } = useMutation("http://localhost:5000/api/bookings");

  const [formData, setFormData] = useState({
    passengerName: "",
    pickup: "",
    dropoff: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bookingData = {
      title: "New",
      bus_id: bus.id,
      parent_id: user?.id,
      child_name: formData.passengerName,
      pickup: formData.pickup,
      dropoff: formData.dropoff,
      price: 500,
    };

    mutate(bookingData)
    .then((response) => {
      console.log("Booking successful:", response);
      alert("Booking successful");
      onClose();
    })
    .catch((error) => {
      console.error("Booking failed:", error);
      alert("Booking failed");
    });
  };

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/30">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md relative">
        <h2 className="text-xl text-center font-semibold mb-4">
          Book Bus: {bus?.plate}
        </h2>

        <form onSubmit={handleSubmit}>
          <input type="hidden" name="bus_id" value={bus.id} />

          <label className="block mb-2">Route Name</label>
          <input
            type="text"
            value={`${route.start} -> ${route.end}`}
            disabled
            className="w-full p-2 mb-4 border rounded-lg border-neutral-400 focus:outline-none text-neutral-600"
          />

          <label className="block mb-2">Passenger Name</label>
          <input
            type="text"
            name="passengerName"
            value={formData.passengerName}
            onChange={handleChange}
            className="w-full p-2 mb-4 border rounded-lg border-neutral-400 focus:outline-none text-neutral-600"
            placeholder="Enter passenger name"
          />

          <label className="block mb-2">Pickup Location</label>
          <select
            name="pickup"
            value={formData.pickup}
            onChange={handleChange}
            className="w-full p-2 mb-4 border rounded-lg border-neutral-400 focus:outline-none text-neutral-600"
            placeholder="e.g. Nairobi CBD"
          >
            <option value="">Select Pickup</option>
            {route.locations.map((location) => (
              <option key={location.id} value={location.location_name}>
                {location.location_name}
              </option>
            ))}
          </select>

          <label className="block mb-2">Dropoff Location</label>
          <select
            name="dropoff"
            value={formData.dropoff}
            onChange={handleChange}
            className="w-full p-2 mb-4 border rounded-lg border-neutral-400 focus:outline-none text-neutral-600"
            placeholder="e.g. Kitengela"
          >
            <option value="">Select Dropoff</option>
            {route.locations.map((location, idx) => {
              const pickupIndex = route.locations.findIndex(
                (location) => location.location_name === formData.pickup
              );

              return (
                <option
                  key={location.id}
                  value={location.location_name}
                  disabled={pickupIndex >= 0 && idx <= pickupIndex}
                >
                  {location.location_name}
                </option>
              );
            })}
          </select>

          {/* <label className="block mb-2">Date</label>
          <input
            type="date"
            className="w-full p-2 mb-4 border rounded-lg border-neutral-400 focus:outline-none text-neutral-600"
          /> */}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-700"
              disabled={creatingBooking}
            >
              {creatingBooking ? "Booking..." : "Confirm Booking"}
            </button>
          </div>
        </form>

        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-600 hover:text-black text-2xl"
        >
          &times;
        </button>
      </div>
    </div>,
    document.body
  );
};

export default BookBusModal;
