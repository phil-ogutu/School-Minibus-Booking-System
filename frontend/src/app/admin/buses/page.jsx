"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useTrips } from "@/hooks/useTrips";
import { v4 as uuidv4 } from "uuid";

// dummy data
const initialBuses = [
  {
    id: 1,
    numberPlate: "KDA 123A",
    make: "Toyota",
    model: "Coaster",
    capacity: 40,
    driver: "Peter Kamau",
  },
  {
    id: 2,
    numberPlate: "KDB 456B",
    make: "Isuzu",
    model: "NQR",
    capacity: 30,
    driver: "Mary Otieno",
  },
  {
    id: 3,
    numberPlate: "KDC 789C",
    make: "Nissan",
    model: "Civilian",
    capacity: 50,
    driver: "James Mwangi",
  },
];

const drivers = [
  { name: "Peter Kamau" },
  { name: "Mary Otieno" },
  { name: "James Mwangi" },
  { name: "Lucy Wanjiku" },
];

const routes = [
  {
    id: 1,
    mainRoad: "Mombasa Rd",
    direction: "Kitengela → CBD",
  },
  {
    id: 2,
    mainRoad: "Outering Rd",
    direction: "Cabanas → Thika Rd",
  },
  {
    id: 3,
    mainRoad: "Thika Rd",
    direction: "Thika → Juja",
  },
];

export default function ManageBuses() {
  const [buses, setBuses] = useState(initialBuses);
  const { trips, createTrip, deleteTrip } = useTrips();

  const [newBus, setNewBus] = useState({
    numberPlate: "",
    make: "",
    model: "",
    capacity: "",
    driver: "",
  });

  const [newTrip, setNewTrip] = useState({
    bus_id: "",
    trip_date: "",
    trip_time: "",
    route_id: "",
  });

  const handleAddBus = () => {
    const bus = {
      ...newBus,
      id: uuidv4(),
      capacity: parseInt(newBus.capacity),
    };
    setBuses((prev) => [...prev, bus]);
    setNewBus({
      numberPlate: "",
      make: "",
      model: "",
      capacity: "",
      driver: "",
    });
  };

  const handleDeleteBus = (id) =>
    setBuses((prev) => prev.filter((bus) => bus.id !== id));

  const handleAddTrip = async () => {
    if (
      !newTrip.bus_id ||
      !newTrip.trip_date ||
      !newTrip.trip_time ||
      !newTrip.route_id
    ) {
      alert("Please fill all trip details");
      return;
    }
    await createTrip(newTrip);
    setNewTrip({
      bus_id: "",
      trip_date: "",
      trip_time: "",
      route_id: "",
    });
  };

  const BusTable = () => (
    <>
      <h2 className="text-xl font-bold mt-8 mb-2">All Buses</h2>
      <table className="min-w-full bg-white border rounded">
        <thead className="bg-[#0F333F] text-white">
          <tr>
            <th className="px-4 py-2 border">Number Plate</th>
            <th className="px-4 py-2 border">Make</th>
            <th className="px-4 py-2 border">Model</th>
            <th className="px-4 py-2 border">Capacity</th>
            <th className="px-4 py-2 border">Driver</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {buses.map((bus) => (
            <tr key={bus.id} className="hover:bg-gray-100">
              <td className="border px-4 py-2">{bus.numberPlate}</td>
              <td className="border px-4 py-2">{bus.make}</td>
              <td className="border px-4 py-2">{bus.model}</td>
              <td className="border px-4 py-2">{bus.capacity}</td>
              <td className="border px-4 py-2">{bus.driver}</td>
              <td className="border px-4 py-2 space-x-2">
                <button className="bg-sky-500 text-white p-1 rounded hover:bg-sky-600">
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDeleteBus(bus.id)}
                  className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );

  const TripsTable = () => (
    <>
      <h2 className="text-xl font-bold mt-8 mb-2">Upcoming Trips</h2>
      <table className="min-w-full bg-white border rounded">
        <thead className="bg-[#0F333F] text-white">
          <tr>
            <th className="px-4 py-2 border">Bus</th>
            <th className="px-4 py-2 border">Route</th>
            <th className="px-4 py-2 border">Date</th>
            <th className="px-4 py-2 border">Time</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {(trips.length
            ? trips
            : [
                {
                  id: 1,
                  bus: { plate: "KDA 123A" },
                  route: "Mombasa Rd - Kitengela → CBD",
                  trip_date: "2025-07-25",
                  trip_time: "08:00",
                },
              ]
          ).map((trip) => (
            <tr key={trip.id} className="hover:bg-gray-100">
              <td className="border px-4 py-2">
                {trip.bus?.plate || trip.bus_id}
              </td>
              <td className="border px-4 py-2">{trip.route}</td>
              <td className="border px-4 py-2">{trip.trip_date}</td>
              <td className="border px-4 py-2">{trip.trip_time}</td>
              <td className="border px-4 py-2">
                <button className="bg-sky-500 text-white p-1 rounded hover:bg-sky-600">
                  <FaEdit />
                </button>

                <button
                  onClick={() => deleteTrip(trip.id)}
                  className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );

  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 p-10 bg-gray-50 min-h-screen">
        <DashboardHeader title="Manage Buses & Trips" />

        {/* Add New Bus Section */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-2">Add New Bus</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <select
              className="p-2 border rounded"
              value={newBus.numberPlate}
              onChange={(e) => {
                const selectedBus = buses.find(
                  (b) => b.numberPlate === e.target.value
                );
                setNewBus({
                  ...newBus,
                  numberPlate: selectedBus.numberPlate,
                  make: selectedBus.make,
                  model: selectedBus.model,
                  capacity: selectedBus.capacity,
                });
              }}
            >
              <option value="">Select Bus</option>
              {buses.map((b) => (
                <option key={b.id} value={b.numberPlate}>
                  {`${b.make} ${b.model} - ${b.numberPlate}`}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Capacity"
              value={newBus.capacity}
              onChange={(e) =>
                setNewBus({ ...newBus, capacity: e.target.value })
              }
              className="p-2 border rounded"
            />
            <select
              className="p-2 border rounded"
              value={newBus.driver}
              onChange={(e) => setNewBus({ ...newBus, driver: e.target.value })}
            >
              <option value="">Select Driver</option>
              {drivers.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddBus}
              className="bg-amber-500 text-white p-2 rounded hover:bg-amber-600 flex items-center justify-center"
            >
              <FaPlus className="mr-2" /> Add Bus
            </button>
          </div>
        </section>

        {/* Add Trip Section */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-2">Add Trip</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <select
              className="p-2 border rounded"
              value={newTrip.bus_id}
              onChange={(e) =>
                setNewTrip({ ...newTrip, bus_id: e.target.value })
              }
            >
              <option value="">Select Bus</option>
              {buses.map((b) => (
                <option key={b.id} value={b.id}>
                  {`${b.make} ${b.model} - ${b.numberPlate}`}
                </option>
              ))}
            </select>

            <select
              className="p-2 border rounded"
              value={newTrip.route_id}
              onChange={(e) =>
                setNewTrip({ ...newTrip, route_id: e.target.value })
              }
            >
              <option value="">Select Route</option>
              {routes.map((r) => (
                <option key={r.id} value={r.id}>
                  {`${r.mainRoad} - ${r.direction}`}
                </option>
              ))}
            </select>

            <input
              type="date"
              className="p-2 border rounded"
              value={newTrip.trip_date}
              onChange={(e) =>
                setNewTrip({ ...newTrip, trip_date: e.target.value })
              }
            />

            <input
              type="time"
              className="p-2 border rounded"
              value={newTrip.trip_time}
              onChange={(e) =>
                setNewTrip({ ...newTrip, trip_time: e.target.value })
              }
            />

            <button
              onClick={handleAddTrip}
              className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600 flex items-center"
            >
              <FaPlus className="mr-2" /> Add Trip
            </button>
          </div>
        </section>

        {/* Tables */}
        <TripsTable />
        <BusTable />
      </main>
    </div>
  );
}
