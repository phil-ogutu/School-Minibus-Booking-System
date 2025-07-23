"use client";
import React from "react";
import { createPortal } from "react-dom";

const BookBusModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/30">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md relative">
        <h2 className="text-xl font-semibold mb-4">Book This Bus</h2>

        <form>
          <input type="hidden" name="bus_id" value=""/>
          <input type="hidden" name="parent_id" value=""/>

          <label className="block mb-2">Passenger Name</label>
          <input
            type="text"
            className="w-full p-2 mb-4 border rounded-lg border-neutral-400 focus:outline-none text-neutral-600"
            placeholder="John Doe"
          />

          <label className="block mb-2">Pickup Location</label>
          <input
            type="text"
            className="w-full p-2 mb-4 border rounded-lg border-neutral-400 focus:outline-none text-neutral-600"
            placeholder="e.g. Nairobi CBD"
          />

          <label className="block mb-2">Dropoff Location</label>
          <input
            type="text"
            className="w-full p-2 mb-4 border rounded-lg border-neutral-400 focus:outline-none text-neutral-600"
            placeholder="e.g. Nairobi CBD"
          />

          <label className="block mb-2">Date</label>
          <input type="date" className="w-full p-2 mb-4 border rounded-lg border-neutral-400 focus:outline-none text-neutral-600" />

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
            >
              Confirm Booking
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