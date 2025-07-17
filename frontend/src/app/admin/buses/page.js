import DashboardSidebar from "@/components/DashboardSidebar";

export default function ManageBuses() {
  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 p-10">
        <h1 className="text-2xl font-bold mb-4">Manage Buses</h1>
        <p className="text-gray-600">
          List of all buses with options to edit or delete.
        </p>
        {/* Implement table here later */}
      </main>
    </div>
  );
}
