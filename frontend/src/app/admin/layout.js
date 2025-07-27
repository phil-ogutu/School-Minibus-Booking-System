import DashboardHeader from "@/components/DashboardHeader";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function AdminLayout({ children }) {
    return (
        <div className="xl:flex h-screen">
            {/* Sidebar */}
            <DashboardSidebar />
            {/* Main Content Area */}
            <div className={`flex-1 transition-all duration-300 ease-in-out`} >
                <DashboardHeader title="Admin Dashboard" />
                <div className="bg-base h-screen overflow-scroll">{children}</div>
            </div>
        </div>
    )
};