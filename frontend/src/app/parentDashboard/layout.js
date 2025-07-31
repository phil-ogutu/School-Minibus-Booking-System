"use client";
import { useAuthContext } from "@/context/AuthContext";
import ParentDashboardSidebar from "@/components/ParentDashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useEffect } from "react";


export default function ParentLayout({ children }) {
    const { user, loading, error } = useAuthContext();
    const router = useRouter();
    useEffect(() => {
        if (!loading && user?.role !== "parent") {
            toast.error("You are not authorized to access this panel");
            router.push("/");
        }
    }, [user, loading, router]);
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