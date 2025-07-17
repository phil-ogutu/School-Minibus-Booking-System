"use client";

const DashboardHeader = ({ title }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">{title}</h1>
      <div className="flex items-center space-x-4">
        <span className="text-gray-600">Admin</span>
        <img
          src="/admin-avatar.png"
          alt="Admin Avatar"
          className="w-10 h-10 rounded-full border"
        />
      </div>
    </div>
  );
};

export default DashboardHeader;
