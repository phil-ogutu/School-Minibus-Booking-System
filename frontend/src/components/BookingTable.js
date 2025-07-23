// components/BookingTable.js
"use client";

import React from "react";
import DataTableB from "./DataTableB";

export default function BookingTable({ bookings, onEdit, onDelete }) {
  const columns = [
    { header: "Child Name", accessor: "child_name" },
    { header: "Pickup", accessor: "pickup" },
    { header: "Dropoff", accessor: "dropoff" },
    {
      header: "Status", 
      accessor: "status", 
      render: (row) => (row.status ? "Active" : "Inactive") // Currently row status is boolean
    },
    { header: "Actions", accessor: "actions", isActionColumn: true },
  ];

  return (
    <DataTableB
      columns={columns}
      data={bookings}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
}
