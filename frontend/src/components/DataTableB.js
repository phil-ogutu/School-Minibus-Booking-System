// components/DataTableB.js
"use client";

export default function DataTable({ columns, data, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full text-sm">
        <thead className="bg-[#0F333F] text-white">
          <tr>
            {columns.map((col) => (
              <th key={col.accessor} className="px-4 py-2 border">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-4">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-100">
                {columns.map((col) => (
                  <td key={col.accessor} className="border px-4 py-2">
                    {col.accessor === "status" ? (
                      col.render ? col.render(row) : row[col.accessor] ? "Active" : "Inactive"
                    ) : col.accessor === "actions" ? (
                      <div className="flex space-x-2">
                        <button
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                          onClick={() => onEdit(row.id)} // Edit booking (pass row.id)
                        >
                          Edit
                        </button>
                        <button
                          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                          onClick={() => onDelete(row.id)} // Delete booking
                        >
                          Delete
                        </button>
                      </div>
                    ) : (
                      row[col.accessor] // Render data normally for other columns
                    )}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}