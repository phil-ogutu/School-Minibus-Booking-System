"use client";

import Container from "./ui/Container";
import { arrowLeftIcon, arrowRightIcon } from "./ui/icons";
import Text from "./ui/Text";

export default function DataTable({ columns, data, onEdit, onDelete, className='' }) {
  return (
    <div className="overflow-x-auto bg-white rounded shadow my-4">
      <table className="min-w-full text-sm">
        <thead className="bg-tertiary text-dark">
          <tr>
            {columns.map((col) => (
              <th key={col.accessor} className="p-4 text-start">
                {col.header}
              </th>
            ))}
          </tr>
        </thead> 
        <tbody>
          {data && data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-4">
                No data available
              </td>
            </tr>
          ) : (
            data && data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-100">
                {columns.map((col) => (
                  <td key={col.accessor} className="p-6 w-20 border-b-1 border-slate-200">
                    {col.accessor === "status" ? (
                      col.render ? col.render(row) : row[col.accessor] ? "Active" : "Inactive"
                    ) : col.accessor === "actions" ? ( col.render(row) ? col.render(row) : (
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
                    )) : (
                      row[col.accessor] // Render data normally for other columns
                    )}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
        <tfoot>
          <tr className="p-2">
            <Container className="flex flex-row align-middle p-4 gap-2">
              <button className="hover:bg-dark bg-tertiary p-2 rounded-sm cursor-pointer">{arrowLeftIcon('','',{marginTop:2})}</button>
              <Text className="my-2">1 of 100</Text>
              <button className="hover:bg-dark bg-tertiary p-2 rounded-sm cursor-pointer">{arrowRightIcon('','',{marginTop:2})}</button>
            </Container>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
