"use client";

import React, { useState, useEffect } from "react";

const EditBusModal = ({ bus, onClose, onSave }) => {
  const [formData, setFormData] = useState({});

  // Populate form with the bus data when the modal is opened
  useEffect(() => {
    if (bus) {
      setFormData(bus); // Use bus data for editing
    }
  }, [bus]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // Save the updated bus data
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold">Edit Bus</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="plate" className="block text-sm font-medium text-gray-700">
              Bus Number Plate
            </label>
            <input
              type="text"
              id="plate"
              name="plate"
              value={formData.plate || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
              Capacity
            </label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="driver" className="block text-sm font-medium text-gray-700">
              Driver
            </label>
            <input
              type="text"
              id="driver"

              name="driver"
              value={formData.driver || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
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

export default EditBusModal;
