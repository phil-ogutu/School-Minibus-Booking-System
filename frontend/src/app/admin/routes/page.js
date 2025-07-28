// "use client";

// import { useState } from "react";
// import DashboardSidebar from "@/components/DashboardSidebar";
// import DashboardHeader from "@/components/DashboardHeader";
// import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
// import { useRoutes } from "@/hooks/useRoutes";

    
//     // { label: "Total Routes", value: routes && routes.length },
//     // { label: "Total Bookings", value: bookings && bookings.length},

// const initialRoutes = [
//   {
//     id: 1,
//     name: "Mombasa Road Route",
//     mainRoad: "Mombasa Road",
//     start: "Kitengela",
//     end: "CBD",
//     commonStages: "Kitengela, Mlolongo, Syokimau, South B, CBD",
//     distanceKm: 30,
//   },
//   {
//     id: 2,
//     name: "Outering Road Route",
//     mainRoad: "Outering Road",
//     start: "Cabanas",
//     end: "Thika Road",
//     commonStages: "Cabanas, Taj Mall, Pipeline, Allsops, Garden City",
//     distanceKm: 18,
//   },
//   {
//     id: 3,
//     name: "Thika Road Route",
//     mainRoad: "Thika Road",
//     start: "Thika",
//     end: "CBD",
//     commonStages: "Thika, Juja, Ruiru, Githurai, Kasarani, CBD",
//     distanceKm: 45,
//   },
// ];

// export default function ManageRoutes() {
//   const { routes } = useRoutes()
//   // const [routes, setRoutes] = useState(routes);
//   const [newRoute, setNewRoute] = useState({
//     name: "",
//     mainRoad: "",
//     start: "",
//     end: "",
//     commonStages: "",
//     distanceKm: "",
//   });

//   const handleAddRoute = () => {
//     if (
//       !newRoute.name ||
//       !newRoute.mainRoad ||
//       !newRoute.start ||
//       !newRoute.end ||
//       !newRoute.commonStages ||
//       !newRoute.distanceKm
//     ) {
//       alert("Please fill in all fields");
//       return;
//     }

//     const route = {
//       ...newRoute,
//       id: Date.now(),
//       distanceKm: parseFloat(newRoute.distanceKm),
//     };
//     setRoutes((prev) => [...prev, route]);
//     setNewRoute({
//       name: "",
//       mainRoad: "",
//       start: "",
//       end: "",
//       commonStages: "",
//       distanceKm: "",
//     });
//   };

//   const handleDelete = (id) => {
//     setRoutes((prev) => prev.filter((route) => route.id !== id));
//   };

//   return (
//     <div className="flex">
//       <DashboardSidebar />
//       <main className="flex-1 p-10 bg-gray-50 min-h-screen">
//         <DashboardHeader title="Manage Routes" />

//         {/* Add New Route Section */}
//         <section className="mb-10">
//           <h2 className="text-xl font-bold mb-2">Add New Route</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//             <input
//               type="text"
//               placeholder="Route Name"
//               value={newRoute.name}
//               onChange={(e) =>
//                 setNewRoute({ ...newRoute, name: e.target.value })
//               }
//               className="p-2 border rounded"
//             />
//             <input
//               type="text"
//               placeholder="Main Road"
//               value={newRoute.mainRoad}
//               onChange={(e) =>
//                 setNewRoute({ ...newRoute, mainRoad: e.target.value })
//               }
//               className="p-2 border rounded"
//             />
//             <input
//               type="text"
//               placeholder="Start Point"
//               value={newRoute.start}
//               onChange={(e) =>
//                 setNewRoute({ ...newRoute, start: e.target.value })
//               }
//               className="p-2 border rounded"
//             />
//             <input
//               type="text"
//               placeholder="End Point"
//               value={newRoute.end}
//               onChange={(e) =>
//                 setNewRoute({ ...newRoute, end: e.target.value })
//               }
//               className="p-2 border rounded"
//             />
//             <input
//               type="text"
//               placeholder="Common Stages"
//               value={newRoute.commonStages}
//               onChange={(e) =>
//                 setNewRoute({ ...newRoute, commonStages: e.target.value })
//               }
//               className="p-2 border rounded"
//             />
//             <input
//               type="number"
//               placeholder="Distance (km)"
//               value={newRoute.distanceKm}
//               onChange={(e) =>
//                 setNewRoute({ ...newRoute, distanceKm: e.target.value })
//               }
//               className="p-2 border rounded"
//             />
//           </div>
//           <button
//             onClick={handleAddRoute}
//             className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center"
//           >
//             <FaPlus className="mr-2" /> Add Route
//           </button>
//         </section>

//         {/* Routes Table */}
//         <table className="min-w-full bg-white border rounded shadow">
//           <thead className="bg-[#0F333F] text-white">
//             <tr>
//               <th className="px-4 py-2 border">Route Name</th>
//               <th className="px-4 py-2 border">Main Road</th>
//               <th className="px-4 py-2 border">Start Point</th>
//               <th className="px-4 py-2 border">End Point</th>
//               <th className="px-4 py-2 border">Common Stages</th>
//               <th className="px-4 py-2 border">Distance (km)</th>
//               <th className="px-4 py-2 border">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {routes.map((route) => (
//               <tr key={route.id} className="hover:bg-gray-100">
//                 <td className="border px-4 py-2">{route.name}</td>
//                 <td className="border px-4 py-2">{route.mainRoad}</td>
//                 <td className="border px-4 py-2">{route.start}</td>
//                 <td className="border px-4 py-2">{route.end}</td>
//                 <td className="border px-4 py-2">{route.commonStages}</td>
//                 <td className="border px-4 py-2">{route.distanceKm} km</td>
//                 <td className="border px-4 py-2 space-x-2">
//                   <button className="bg-sky-500 text-white p-1 rounded hover:bg-sky-600">
//                     <FaEdit />
//                   </button>
//                   <button
//                     onClick={() => handleDelete(route.id)}
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
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useRoutes } from "@/hooks/useRoutes";

export default function ManageRoutes() {
  const { routes, routesLoading, routesError, creating, updating, deleting, createNewRoute, deleteExistingRoute, fetchRoutes, updateExistingRoute } = useRoutes();
  const [newRoute, setNewRoute] = useState({
    // name: "",
    // mainRoad: "",
    start: "",
    end: "",
    // commonStages: "",
    // distanceKm: "",
  });
  // console.log('ROUTES ', routes[0].locations[0].location_name)

  const [editingRoute, setEditingRoute] = useState(null); // For modal editing
  const [showModal, setShowModal] = useState(false); // For modal visibility

  // Fetch routes on initial load
  useEffect(() => {
    fetchRoutes();
  }, []);

  // Handle adding a new route
  const handleAddRoute = async () => {
    if (
      // !newRoute.name ||
      // !newRoute.mainRoad ||
      !newRoute.start ||
      !newRoute.end 
      // !newRoute.commonStages ||
      // !newRoute.distanceKm
    ) {
      alert("Please fill in all fields");
      return;
    }

    const routeData = {
      ...newRoute,
      // distanceKm: parseFloat(newRoute.distanceKm),
    };

    await createNewRoute(routeData);
    setNewRoute({
      // name: "",
      // mainRoad: "",
      start: "",
      end: "",
      // commonStages: "",
      // distanceKm: "",
    });
  };

  // Handle updating a route
  const handleUpdateRoute = async () => {
    if (!editingRoute) return;
    const sieveRoute = {
      id: editingRoute.id,
      start: editingRoute.start,
      end: editingRoute.end,
      status: editingRoute.status
    }
    await updateExistingRoute(sieveRoute.id, sieveRoute);
    setShowModal(false);
  };

  // Handle deleting a route
  const handleDeleteRoute = async (id) => {
    await deleteExistingRoute(id);
  };

  // Handle editing route modal open
  const openEditModal = (route) => {
    setEditingRoute(route);
    setShowModal(true);
  };

  // Handle modal input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingRoute((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 p-10 bg-gray-50 min-h-screen">
        <DashboardHeader title="Manage Routes" />

        {/* Add New Route Section */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-2">Add New Route</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Route Name"
              value={newRoute.name}
              onChange={(e) =>
                setNewRoute({ ...newRoute, name: e.target.value })
              }
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Main Road"
              value={newRoute.mainRoad}
              onChange={(e) =>
                setNewRoute({ ...newRoute, mainRoad: e.target.value })
              }
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Start Point"
              value={newRoute.start}
              onChange={(e) =>
                setNewRoute({ ...newRoute, start: e.target.value })
              }
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="End Point"
              value={newRoute.end}
              onChange={(e) =>
                setNewRoute({ ...newRoute, end: e.target.value })
              }
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Common Stages"
              value={newRoute.commonStages}
              onChange={(e) =>
                setNewRoute({ ...newRoute, commonStages: e.target.value })
              }
              className="p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Distance (km)"
              value={newRoute.distanceKm}
              onChange={(e) =>
                setNewRoute({ ...newRoute, distanceKm: e.target.value })
              }
              className="p-2 border rounded"
            />
          </div>
          <button
            onClick={handleAddRoute}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center"
          >
            <FaPlus className="mr-2" /> Add Route
          </button>
        </section>

        {/* Routes Table */}
        <section>
          <h2 className="text-xl font-bold mb-4">Routes</h2>

          {routesLoading && <p>Loading routes...</p>}
          {routesError && <p className="text-red-500">Error loading routes!</p>}

          <table className="min-w-full bg-white border rounded shadow">
            <thead className="bg-[#0F333F] text-white">
              <tr>
                <th className="px-4 py-2 border">Route Ref</th>
                {/* <th className="px-4 py-2 border">Main Road</th> */}
                <th className="px-4 py-2 border">Start Point</th>
                <th className="px-4 py-2 border">End Point</th>
                {/* <th className="px-4 py-2 border">Common Stages</th> */}
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {routes && routes.map((route) => (
                <tr key={route.id} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{route.id}</td>
                  {/* <td className="border px-4 py-2">{route.mainRoad || null }</td> */}
                  <td className="border px-4 py-2">{route.start}</td>
                  <td className="border px-4 py-2">{route.end}</td>
                  {/* <td className="border px-4 py-2">{route.locations && routes[0].locations[0].location_name}</td> */}
                  <td className="border px-4 py-2">{route.status}</td>
                  <td className="border px-4 py-2 space-x-2">
                    <button
                      onClick={() => openEditModal(route)}
                      className="bg-sky-500 text-white p-1 rounded hover:bg-sky-600"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteRoute(route.id)}
                      className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Modal for Editing Route */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg w-1/2">
              <h3 className="text-xl font-bold mb-4">Edit Route</h3>
              <input
                type="text"
                name="name"
                value={editingRoute.name}
                onChange={handleInputChange}
                placeholder="Route Name"
                className="p-2 mb-4 border rounded w-full"
              />
              <input
                type="text"
                name="mainRoad"
                value={editingRoute.mainRoad}
                onChange={handleInputChange}
                placeholder="Main Road"
                className="p-2 mb-4 border rounded w-full"
              />
              <input
                type="text"
                name="start"
                value={editingRoute.start}
                onChange={handleInputChange}
                placeholder="Start Point"
                className="p-2 mb-4 border rounded w-full"
              />
              <input
                type="text"
                name="end"
                value={editingRoute.end}
                onChange={handleInputChange}
                placeholder="End Point"
                className="p-2 mb-4 border rounded w-full"
              />
              <input
                type="text"
                name="commonStages"
                value={editingRoute.commonStages}
                onChange={handleInputChange}
                placeholder="Common Stages"
                className="p-2 mb-4 border rounded w-full"
              />
              <input
                type="number"
                name="distanceKm"
                value={editingRoute.distanceKm}
                onChange={handleInputChange}
                placeholder="Distance (km)"
                className="p-2 mb-4 border rounded w-full"
              />
                <select
                  name="status"
                  value={editingRoute.status}
                  onChange={handleInputChange}
                  className="p-2 mb-4 border rounded w-full"
                >
                  <option value="pending">Pending</option>
                  <option value="started">Started</option>
                  <option value="ended">Ended</option>
                </select>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateRoute}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
