"use client";
import React from "react";
import { createPortal } from "react-dom";
import { useState } from "react";
import { useBookings } from "@/hooks/useBookings";
import { useMutation } from "@/hooks/useMutation";
import { useAuthContext } from "@/context/AuthContext";
import { useEffect } from "react";
import { haversineDistance, calculatePrice } from "@/utils/distance";
import { FaBus, FaCreditCard, FaMapMarkerAlt, FaUser } from "react-icons/fa";

const BookBusModal = ({ isOpen, onClose, route, bus, onNavigate }) => {
  if (!isOpen || !route || !bus) return null;

  const { user } = useAuthContext();
  const { creatingBooking } = useBookings();

  const { mutate } = useMutation("/api/bookings");
  const [price, setPrice] = useState(0);

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

  useEffect(() => {
    if (formData.pickup && formData.dropoff) {
      const pickupLoc = route.locations.find(
        (location) => location.location_name === formData.pickup
      );
      const dropoffLoc = route.locations.find(
        (location) => location.location_name === formData.dropoff
      );

      if (pickupLoc && dropoffLoc) {
        const distance = haversineDistance(
          { lat: pickupLoc.latitude, lng: pickupLoc.longitude },
          { lat: dropoffLoc.latitude, lng: dropoffLoc.longitude }
        );
        const computedPrice = calculatePrice(distance);
        setPrice(computedPrice.toFixed(2));
      }
    }
  }, [formData.pickup, formData.dropoff, route.locations]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bookingTitle = `${formData.passengerName} - ${route.start} -> ${route.end}`;

    const bookingData = {
      title: bookingTitle,
      bus_id: bus.id,
      parent_id: user?.id,
      child_name: formData.passengerName,
      pickup: formData.pickup,
      dropoff: formData.dropoff,
      price: price,
    };

    mutate(bookingData)
      .then((response) => {
        console.log("Booking successful:", response);
        alert("Booking successful");

        const bookingId = response?.id || response?.data?.id;
        if (bookingId) {
          onNavigate(bookingId);
        } else {
          console.warn("Booking ID not found in response");
        }

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
          Book Your Ticket
        </h2>

        <form onSubmit={handleSubmit}>
          <input type="hidden" name="bus_id" value={bus.id} />

          <div className="flex flex-col bg-neutral-200/30 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <FaBus />
              <span>Bus {bus?.plate}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt />
              <span>{`${route.start} -> ${route.end}`}</span>
            </div>
          </div>

          <hr className="h-px my-5 bg-gray-200 border-0 dark:bg-gray-700" />

          <label className="block mb-2 flex gap-2 items-center">
            <FaUser /> Passenger Name
          </label>
          <input
            type="text"
            name="passengerName"
            value={formData.passengerName}
            onChange={handleChange}
            className="w-full p-2 mb-4 border rounded-lg border-neutral-400 focus:outline-none text-neutral-600"
            placeholder="Enter passenger name"
          />

          <label className="block mb-2 flex gap-2 items-center">
            <FaMapMarkerAlt /> Pickup Location
          </label>
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

          <label className="block mb-2 flex gap-2 items-center">
            <FaMapMarkerAlt />
            Dropoff Location
          </label>
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
          <div className="h-10 mb-5 p-4 rounded-md">
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <FaCreditCard /> Total price
              </div>
              <span>Ksh {price}</span>
            </div>
          </div>

          <hr className="h-px my-5 bg-gray-200 border-0 dark:bg-gray-700" />

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
