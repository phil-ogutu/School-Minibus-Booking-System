// "use client";

// import { useState } from "react";
// import DashboardSidebar from "@/components/DashboardSidebar";
// import DashboardHeader from "@/components/DashboardHeader";
// import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

// const initialBuses = [
//   { id: 1, numberPlate: "KDA 123A", capacity: 40, driver: "Peter Kamau" },
//   { id: 2, numberPlate: "KDB 456B", capacity: 30, driver: "Mary Otieno" },
// ];

// export default function ManageBuses() {
//   const [buses, setBuses] = useState(initialBuses);
//   const [newBus, setNewBus] = useState({
//     numberPlate: "",
//     capacity: "",
//     driver: "",
//   });

//   const handleAddBus = () => {
//     const bus = {
//       ...newBus,
//       id: Date.now(),
//       capacity: parseInt(newBus.capacity),
//     };
//     setBuses([...buses, bus]);
//     setNewBus({ numberPlate: "", capacity: "", driver: "" });
//   };

//   const handleDelete = (id) => setBuses(buses.filter((bus) => bus.id !== id));

//   return (
//     <div className="flex">
//       <DashboardSidebar />
//       <main className="flex-1 p-10 bg-gray-50 min-h-screen">
//         <DashboardHeader title="Manage Buses" />

//         <div className="mb-6">
//           <h2 className="text-xl font-bold mb-2">Add New Bus</h2>
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
//             <input
//               type="text"
//               placeholder="Number Plate"
//               value={newBus.numberPlate}
//               onChange={(e) =>
//                 setNewBus({ ...newBus, numberPlate: e.target.value })
//               }
//               className="p-2 border rounded"
//             />
//             <input
//               type="number"
//               placeholder="Capacity"
//               value={newBus.capacity}
//               onChange={(e) =>
//                 setNewBus({ ...newBus, capacity: e.target.value })
//               }
//               className="p-2 border rounded"
//             />
//             <input
//               type="text"
//               placeholder="Driver"
//               value={newBus.driver}
//               onChange={(e) => setNewBus({ ...newBus, driver: e.target.value })}
//               className="p-2 border rounded"
//             />
//             <button
//               onClick={handleAddBus}
//               className="bg-amber-500 text-white p-2 rounded hover:bg-amber-600 flex items-center justify-center"
//             >
//               <FaPlus className="mr-2" /> Add
//             </button>
//           </div>
//         </div>

//         <table className="min-w-full bg-white border rounded">
//           <thead className="bg-[#0F333F] text-white">
//             <tr>
//               <th className="px-4 py-2 border">Number Plate</th>
//               <th className="px-4 py-2 border">Capacity</th>
//               <th className="px-4 py-2 border">Driver</th>
//               <th className="px-4 py-2 border">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {buses.map((bus) => (
//               <tr key={bus.id} className="hover:bg-gray-100">
//                 <td className="border px-4 py-2">{bus.numberPlate}</td>
//                 <td className="border px-4 py-2">{bus.capacity}</td>
//                 <td className="border px-4 py-2">{bus.driver}</td>
//                 <td className="border px-4 py-2 space-x-2">
//                   <button className="bg-sky-500 text-white p-1 rounded hover:bg-sky-600">
//                     <FaEdit />
//                   </button>
//                   <button
//                     onClick={() => handleDelete(bus.id)}
//                     className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
//                   >
//                     <FaTrash />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </main>
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
// import DashboardSidebar from "@/components/DashboardSidebar";
// import DashboardHeader from "@/components/DashboardHeader";
// import { useBuses } from "@/hooks/useBuses"; // Import the hook
// import axiosInstance from "@/lib/api";

// export default function ManageBuses() {
//   const { buses, busesLoading, busesError, createNewBus, deleteExistingBus } = useBuses(); // Using the hook

//   const [newBus, setNewBus] = useState({
//     plate: "",
//     capacity: "",
//     driver: "",
//   });

//   const [driverNames, setDriverNames] = useState({});

//   // Fetch driver names for all buses
//   const fetchDriverNames = async () => {
//     try {
//       const driverIds = buses.map((bus) => bus.driver_id);
//       const uniqueDriverIds = [...new Set(driverIds)]; // Remove duplicate driver IDs

//       // Fetch names for all unique driver IDs
//       const driverResponses = await Promise.all(
//         uniqueDriverIds.map((id) =>
//           axiosInstance.get(`/drivers/${id}`).then((response) => ({
//             id,
//             name: response.data.driver_name,
//           }))
//         )
//       );

//       // Map the driver data into an object for quick lookup
//       const driversMap = driverResponses.reduce((acc, { id, name }) => {
//         acc[id] = name;
//         return acc;
//       }, {});

//       setDriverNames(driversMap);
//     } catch (error) {
//       console.error("Error fetching drivers:", error);
//     }
//   };

//   useEffect(() => {
//     if (!busesLoading && buses && buses.length > 0) {
//       fetchDriverNames();
//     }
//   }, [busesLoading, buses]);

//   const handleAddBus = async () => {
//     const bus = {
//       ...newBus,
//       capacity: parseInt(newBus.capacity),
//     };

//     try {
//       await createNewBus(bus); // Create bus via API
//       setNewBus({ plate: "", capacity: "", driver: "" }); // Reset input fields after adding
//     } catch (error) {
//       console.error("Error creating bus:", error);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await deleteExistingBus(id); // Delete bus via API
//     } catch (error) {
//       console.error("Error deleting bus:", error);
//     }
//   };

//   if (busesLoading) {
//     return <div>Loading buses...</div>; // Loading state
//   }

//   if (busesError) {
//     return <div>Error loading buses: {busesError}</div>; // Error state
//   }

//   return (
//     <div className="flex">
//       <DashboardSidebar />
//       <main className="flex-1 p-10 bg-gray-50 min-h-screen">
//         <DashboardHeader title="Manage Buses" />

//         <div className="mb-6">
//           <h2 className="text-xl font-bold mb-2">Add New Bus</h2>
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
//             <input
//               type="text"
//               placeholder="Number Plate"
//               value={newBus.plate}
//               onChange={(e) =>
//                 setNewBus({ ...newBus, plate: e.target.value })
//               }
//               className="p-2 border rounded"
//             />
//             <input
//               type="number"
//               placeholder="Capacity"
//               value={newBus.capacity}
//               onChange={(e) =>
//                 setNewBus({ ...newBus, capacity: e.target.value })
//               }
//               className="p-2 border rounded"
//             />
//             <input
//               type="text"
//               placeholder="Driver"
//               value={newBus.driver}
//               onChange={(e) => setNewBus({ ...newBus, driver: e.target.value })}
//               className="p-2 border rounded"
//             />
//             <button
//               onClick={handleAddBus}
//               className="bg-amber-500 text-white p-2 rounded hover:bg-amber-600 flex items-center justify-center"
//             >
//               <FaPlus className="mr-2" /> Add
//             </button>
//           </div>
//         </div>

//         <table className="min-w-full bg-white border rounded">
//           <thead className="bg-[#0F333F] text-white">
//             <tr>
//               <th className="px-4 py-2 border">Number Plate</th>
//               <th className="px-4 py-2 border">Capacity</th>
//               <th className="px-4 py-2 border">Driver</th>
//               <th className="px-4 py-2 border">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {buses.map((bus) => (
//               <tr key={bus.id} className="hover:bg-gray-100">
//                 <td className="border px-4 py-2">{bus.plate}</td>
//                 <td className="border px-4 py-2">{bus.capacity}</td>
//                 <td className="border px-4 py-2">
//                   {driverNames[bus.driver_id] || "Loading..."}
//                 </td>
//                 <td className="border px-4 py-2 space-x-2">
//                   <button className="bg-sky-500 text-white p-1 rounded hover:bg-sky-600">
//                     <FaEdit />
//                   </button>
//                   <button
//                     onClick={() => handleDelete(bus.id)}
//                     className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
//                   >
//                     <FaTrash />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </main>
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { useBuses } from "@/hooks/useBuses";
import EditBusModal from "@/components/EditBusModal"; // Import the modal

export default function ManageBuses() {
  const { buses, busesLoading, busesError, createNewBus, deleteExistingBus, fetchBuses, updateExistingBus } = useBuses();

  const [newBus, setNewBus] = useState({
    plate: "",
    capacity: "",
    driver: "",
  });

  const [selectedBus, setSelectedBus] = useState(null); // For selected bus to edit
  const [showModal, setShowModal] = useState(false); // Control modal visibility

  // Fetch buses on initial load
  useEffect(() => {
    fetchBuses();
  }, []);

  // const handleAddBus = async () => {
  //   try {
  //     await createNewBus(newBus);
  //     setNewBus({ plate: "", capacity: "", driver: "" }); // Reset after adding
  //   } catch (error) {
  //     console.error("Error creating bus:", error);
  //   }
  // };

  // const handleEditBus = (bus) => {
  //   setSelectedBus(bus); // Set bus data to edit
  //   setShowModal(true); // Show the modal
  // };

  const handleAddBus = async () => {
  const bus = {
    ...newBus,
    capacity: parseInt(newBus.capacity),
    route_id: newBus.route_id,  // Make sure to set the route_id
    driver_id: newBus.driver_id, // Ensure you add this field too (if needed)
    owner_id: newBus.owner_id,   // Ensure this field is available
  };

  try {
    await createNewBus(bus); // Create bus via API
    setNewBus({ plate: "", capacity: "", driver: "", route_id: "", owner_id: "" }); // Reset input fields after adding
  } catch (error) {
    console.error("Error creating bus:", error);
  }
};


  const handleSaveBus = async (updatedBus) => {
    await updateExistingBus(updatedBus.id, updatedBus); // Save bus changes via API
    setShowModal(false); // Close modal after saving
  };

  const handleDelete = async (id) => {
    try {
      await deleteExistingBus(id); // Delete bus from local state and server
    } catch (error) {
      console.error("Error deleting bus:", error);
    }
  };

  if (busesLoading) {
    return <div>Loading buses...</div>;
  }

  if (busesError) {
    return <div>Error loading buses: {busesError}</div>;
  }

  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 p-10 bg-gray-50 min-h-screen">
        <DashboardHeader title="Manage Buses" />
{/* 
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Add New Bus</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              placeholder="Number Plate"
              value={newBus.plate}
              onChange={(e) => setNewBus({ ...newBus, plate: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Capacity"
              value={newBus.capacity}
              onChange={(e) => setNewBus({ ...newBus, capacity: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Driver"
              value={newBus.driver}
              onChange={(e) => setNewBus({ ...newBus, driver: e.target.value })}
              className="p-2 border rounded"
            />
            <button
              onClick={handleAddBus}
              className="bg-amber-500 text-white p-2 rounded hover:bg-amber-600 flex items-center justify-center"
            >
              <FaPlus className="mr-2" /> Add
            </button>
          </div>
        </div> */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            placeholder="Number Plate"
            value={newBus.plate}
            onChange={(e) => setNewBus({ ...newBus, plate: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Capacity"
            value={newBus.capacity}
            onChange={(e) => setNewBus({ ...newBus, capacity: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Driver ID"  // Add Driver ID
            value={newBus.driver_id}
            onChange={(e) => setNewBus({ ...newBus, driver_id: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Route ID"  // Add Route ID
            value={newBus.route_id}
            onChange={(e) => setNewBus({ ...newBus, route_id: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Owner ID"  // Add Owner ID
            value={newBus.owner_id}
            onChange={(e) => setNewBus({ ...newBus, owner_id: e.target.value })}
            className="p-2 border rounded"
          />
          <button
            onClick={handleAddBus}
            className="bg-amber-500 text-white p-2 rounded hover:bg-amber-600 flex items-center justify-center"
          >
            <FaPlus className="mr-2" /> Add
          </button>
        </div>


        <table className="min-w-full bg-white border rounded">
          <thead className="bg-[#0F333F] text-white">
            <tr>
              <th className="px-4 py-2 border">Number Plate</th>
              <th className="px-4 py-2 border">Capacity</th>
              <th className="px-4 py-2 border">Driver</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {buses.map((bus) => (
              <tr key={bus.id} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{bus.plate}</td>
                <td className="border px-4 py-2">{bus.capacity}</td>
                <td className="border px-4 py-2">{bus.driver}</td>
                <td className="border px-4 py-2 space-x-2">
                  <button onClick={() => handleEditBus(bus)} className="bg-sky-500 text-white p-1 rounded hover:bg-sky-600">
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(bus.id)}
                    className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      {/* Edit Modal */}
      {showModal && (
        <EditBusModal bus={selectedBus} onClose={() => setShowModal(false)} onSave={handleSaveBus} />
      )}
    </div>
  );
}
