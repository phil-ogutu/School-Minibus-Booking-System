import DashboardHeader from "@/components/DashboardHeader";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen xl:flex">
            {/* Sidebar */}
            <DashboardSidebar />
            {/* Main Content Area */}
            <div className={`flex-1 transition-all duration-300 ease-in-out`} >
                <DashboardHeader title="Admin Dashboard" />
                <div className="bg-tertiary">{children}</div>
            </div>
        </div>
    )
};