// // src/hooks/useBuses.js
// import { useFetch } from './useFetch';
// import { useMutation } from './useMutation';
// // INCLUDED BASE URL
// export const useBuses = () => {
//   const { data: buses, loading: busesLoading, error: busesError } = useFetch('/api/buses');
//   const { mutate: createBus } = useMutation('/api/buses');
//   const { mutate: updateBus } = useMutation('/api/buses', 'PATCH');
//   const { mutate: deleteBus } = useMutation('/api/buses', 'DELETE');

//   const getBusById = (id) => {
//     const { data, loading, error } = useFetch(`/api/buses/${id}`);
//     return { bus: data, loading, error };
//   };

//   const createNewBus = async (busData) => {
//     return await createBus(busData);
//   };

//   const updateExistingBus = async (id, updates) => {
//     return await updateBus(updates, `/api/buses/${id}`);
//   };

//   const deleteExistingBus = async (id) => {
//     return await deleteBus({}, `/api/buses/${id}`);
//   };

//   return {
//     buses,
//     busesLoading,
//     busesError,
//     getBusById,
//     createNewBus,
//     updateExistingBus,
//     deleteExistingBus,
//   };
// };

import { useState } from "react";
import axiosInstance from "@/lib/api"; // Ensure you import axiosInstance

export const useBuses = () => {
  const [buses, setBuses] = useState([]);
  const [busesLoading, setBusesLoading] = useState(true);
  const [busesError, setBusesError] = useState(null);

  // Fetch all buses
  const fetchBuses = async () => {
    try {
      const response = await axiosInstance.get("/api/buses");
      setBuses(response.data);
    } catch (error) {
      setBusesError(error.message);
    } finally {
      setBusesLoading(false);
    }
  };

  // Create new bus
  const createNewBus = async (busData) => {
    try {
      const response = await axiosInstance.post("/api/buses", busData);
      setBuses((prevBuses) => [...prevBuses, response.data]); // Optimistically update local state
    } catch (error) {
      console.error("Error creating bus:", error);
    }
  };

  // Update existing bus
  const updateExistingBus = async (id, updatedBus) => {
    try {
      const response = await axiosInstance.patch(`/api/buses/${id}`, updatedBus);
      setBuses((prevBuses) =>
        prevBuses.map((bus) => (bus.id === id ? response.data : bus))
      ); // Update the bus in local state
    } catch (error) {
      console.error("Error updating bus:", error);
    }
  };

  // Delete a bus
  const deleteExistingBus = async (id) => {
    try {
      await axiosInstance.delete(`/api/buses/${id}`);
      setBuses((prevBuses) => prevBuses.filter((bus) => bus.id !== id)); // Optimistically remove from local state
    } catch (error) {
      console.error("Error deleting bus:", error);
    }
  };

  return {
    buses,
    busesLoading,
    busesError,
    fetchBuses,
    createNewBus,
    updateExistingBus,
    deleteExistingBus,
  };
};
