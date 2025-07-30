'use client'
import DashboardHeader from "@/components/DashboardHeader";
import DashboardSidebar from "@/components/DashboardSidebar";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
    const { user, loading, error } = useAuthContext();
    const router = useRouter();
    console.log(user)
    if(user && user?.role != 'admin'){
        alert('you are not authorized to access this panel');
        router.push('/');
        return;
    };
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