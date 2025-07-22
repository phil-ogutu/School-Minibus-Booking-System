"use client";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";

const parents = [
  { id: 1, name: "John Doe", children: ["Alice M.", "Ben M."] },
  { id: 2, name: "Jane Smith", children: ["Clara S."] },
];

export default function ParentsChildren() {
  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 p-10">
        <DashboardHeader title="Parents & Children" />
        <div className="space-y-4">
          {parents.map((p) => (
            <div key={p.id} className="p-4 border rounded bg-white">
              <h3 className="font-bold">{p.name}</h3>
              <p className="text-sm text-gray-600">
                Children: {p.children.join(", ")}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
