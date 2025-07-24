"use client";

export default function DataTable({ columns, data }) {
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
          {data?.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-4">
                No data available
              </td>
            </tr>
          ) : (
            data?.map((booking, idx) => (
              <tr key={idx} className="hover:bg-gray-100">
                {columns.map((col) => (
                  <td key={col.accessor} className="border px-4 py-2">
                    {col.render
                      ? col.render(booking[col.accessor], booking)
                      : booking[col.accessor]}
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
