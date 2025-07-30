"use client";
import { useAuthContext } from "@/context/AuthContext";
import ParentDashboardSidebar from "@/components/ParentDashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { useRouter } from "next/navigation";

export default function ParentLayout({ children }) {
    const { user, loading, error } = useAuthContext();
    const router = useRouter();
    console.log(user)
    if(user && user?.role != 'parent'){
        alert('you are not authorized to access this panel');
        router.push('/');
        return;
    };
    return (
        <div className="xl:flex h-screen">
            {/* Sidebar */}
            <ParentDashboardSidebar />
            {/* Main Content Area */}
            <div className={`flex-1 transition-all duration-300 ease-in-out`} >
                <DashboardHeader title="Parent Dashboard" />
                <div className="bg-base h-screen overflow-scroll">{children}</div>
            </div>
        </div>
    )
};