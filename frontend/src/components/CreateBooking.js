// src/components/CreateBooking.js

import { useState } from 'react';
import { useBookings } from '@/hooks/useBookings';

const CreateBooking = ({ onClose }) => {
  const { createNewBooking, creatingBooking, fetchBookings } = useBookings();

  const [formData, setFormData] = useState({
    child_name: '',
    pickup: '',
    dropoff: '',
    price: 0,
    status: true,
    title: '',
    bus_id: '',
    parent_id: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
        child_name: formData.child_name,
        pickup: formData.pickup,
        dropoff: formData.dropoff,
        price: parseFloat(formData.price), // Ensure price is a float
        // status: formData.status,
        title: formData.title,
        bus_id: formData.bus_id,
        parent_id: formData.parent_id,
    };

    await createNewBooking(data); // Call the createNewBooking mutation
    onClose(); // Close the form after submission
    };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-6 text-center">Create New Booking</h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="form-group">
              <label className="block font-medium">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div className="form-group">
              <label className="block font-medium">Child's Name</label>
              <input
                type="text"
                name="child_name"
                value={formData.child_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div className="form-group">
              <label className="block font-medium">Pickup Location</label>
              <input
                type="text"
                name="pickup"
                value={formData.pickup}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div className="form-group">
              <label className="block font-medium">Dropoff Location</label>
              <input
                type="text"
                name="dropoff"
                value={formData.dropoff}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div className="form-group">
              <label className="block font-medium">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div className="form-group">
              <label className="block font-medium">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </select>
            </div>

            <div className="form-group">
              <label className="block font-medium">Bus ID</label>
              <input
                type="text"
                name="bus_id"
                value={formData.bus_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div className="form-group">
              <label className="block font-medium">Parent ID</label>
              <input
                type="text"
                name="parent_id"
                value={formData.parent_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div className="flex justify-between mt-6">
              <button
                type="submit"
                disabled={creatingBooking}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg shadow-sm hover:bg-blue-600 disabled:bg-gray-400"
              >
                {creatingBooking ? 'Saving...' : 'Create Booking'}
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={onClose}
                className="text-red-500 hover:text-red-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBooking;
