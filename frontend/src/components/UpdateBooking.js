import { useEffect, useState } from 'react';
import { useBookings } from '@/hooks/useBookings';

const UpdateBookingForm = ({ bookingId, onClose }) => {
  const { getBookingById, updateExistingBooking } = useBookings();
  
  // State to manage the form data
  const [formData, setFormData] = useState({
    title: '',
    child_name: '',
    pickup: '',
    dropoff: '',
    price: '',
    status: true,
    bus_id: '',
    parent_id: ''
  });

  // Fetch the booking details when the form is opened
  useEffect(() => {
    const { booking } = getBookingById(bookingId);
    if (booking) {
      setFormData({
        title: booking.title,
        child_name: booking.child_name,
        pickup: booking.pickup,
        dropoff: booking.dropoff,
        price: booking.price.toString(),
        status: booking.status,
        bus_id: booking.bus_id,
        parent_id: booking.parent_id
      });
    }
  }, [bookingId, getBookingById]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedBooking = {
      ...formData,
      price: parseFloat(formData.price)
    };
    await updateExistingBooking(bookingId, updatedBooking);
    onClose(); // Close the modal after updating
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-semibold mb-4">Update Booking</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="child_name" className="block text-sm font-medium text-gray-700">
              Child Name
            </label>
            <input
              type="text"
              name="child_name"
              id="child_name"
              value={formData.child_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="pickup" className="block text-sm font-medium text-gray-700">
              Pickup Location
            </label>
            <input
              type="text"
              name="pickup"
              id="pickup"
              value={formData.pickup}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="dropoff" className="block text-sm font-medium text-gray-700">
              Drop-off Location
            </label>
            <input
              type="text"
              name="dropoff"
              id="dropoff"
              value={formData.dropoff}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              name="price"
              id="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              name="status"
              id="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </select>
          </div>

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Update Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateBookingForm;
