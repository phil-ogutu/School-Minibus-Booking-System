"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const initialOwnerships = [
  {
    id: 1,
    ownerName: "Green Transport Ltd",
    busNumber: "KDA 123A",
    makeModel: "Isuzu NPR",
    yom: 2018,
    capacity: 40,
    status: "Active",
    contact: "+254 700 123 456",
  },
  {
    id: 2,
    ownerName: "Mary Otieno",
    busNumber: "KDB 456B",
    makeModel: "Toyota Coaster",
    yom: 2016,
    capacity: 30,
    status: "Inactive",
    contact: "+254 711 987 654",
  },
  {
    id: 3,
    ownerName: "Blue Line Coaches",
    busNumber: "KDC 789C",
    makeModel: "Mitsubishi Rosa",
    yom: 2020,
    capacity: 35,
    status: "Active",
    contact: "+254 722 555 888",
  },
];

export default function BusOwners() {
  const [ownerships, setOwnerships] = useState(initialOwnerships);
  const [form, setForm] = useState({
    ownerName: "",
    contact: "",
    makeModel: "",
    yom: "",
    busNumber: "",
    capacity: "",
    status: "Active",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddOwner = (e) => {
    e.preventDefault();
    const newEntry = {
      id: Date.now(),
      ...form,
      yom: Number(form.yom),
      capacity: Number(form.capacity),
    };
    setOwnerships([...ownerships, newEntry]);
    setForm({
      ownerName: "",
      contact: "",
      makeModel: "",
      yom: "",
      busNumber: "",
      capacity: "",
      status: "Active",
    });
  };

  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 p-10 bg-gray-50 min-h-screen">
        <DashboardHeader title="Bus Ownership Management" />

        {/* Add Owner & Bus Form */}
        <form
          onSubmit={handleAddOwner}
          className="mb-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end"
        >
          <input
            name="ownerName"
            placeholder="Owner Name"
            value={form.ownerName}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            name="contact"
            placeholder="Contact"
            value={form.contact}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            name="makeModel"
            placeholder="Make & Model"
            value={form.makeModel}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            name="yom"
            placeholder="Year"
            value={form.yom}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            name="busNumber"
            placeholder="Plate Number"
            value={form.busNumber}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            name="capacity"
            placeholder="Capacity"
            value={form.capacity}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="p-2 border rounded"
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded flex items-center justify-center hover:bg-green-700"
          >
            <FaPlus className="mr-2" /> Add
          </button>
        </form>

        {/* Ownership Table */}
        <table className="min-w-full bg-white border rounded shadow">
          <thead className="bg-[#0F333F] text-white">
            <tr>
              <th className="px-4 py-2 border">Owner Name</th>
              <th className="px-4 py-2 border">Contact</th>
              <th className="px-4 py-2 border">Make & Model</th>
              <th className="px-4 py-2 border">YOM</th>
              <th className="px-4 py-2 border">Bus Plate Number</th>
              <th className="px-4 py-2 border">Capacity</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ownerships.map((bus) => (
              <tr key={bus.id} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{bus.ownerName}</td>
                <td className="border px-4 py-2">{bus.contact}</td>
                <td className="border px-4 py-2">{bus.makeModel}</td>
                <td className="border px-4 py-2">{bus.yom}</td>
                <td className="border px-4 py-2">{bus.busNumber}</td>
                <td className="border px-4 py-2">{bus.capacity}</td>
                <td className="border px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-white ${
                      bus.status === "Active" ? "bg-green-500" : "bg-gray-500"
                    }`}
                  >
                    {bus.status}
                  </span>
                </td>
                <td className="border px-4 py-2 space-x-2">
                  <button className="bg-sky-500 text-white p-1 rounded hover:bg-sky-600">
                    <FaEdit />
                  </button>
                  <button className="bg-red-500 text-white p-1 rounded hover:bg-red-600">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
