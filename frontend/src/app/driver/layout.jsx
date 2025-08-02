'use client'
import { Header as DriverHeader } from "./components/Header";
import DashboardSidebar from "@/components/reusables/dashboardSidebar";
import { FormField, FormWrapper } from "@/components/ui/Form";
import Modal from "@/components/ui/Modal";
import Text from "@/components/ui/Text";
import { useAuthContext } from "@/context/AuthContext";
import { useModal } from "@/hooks/useModal";
import { BASE_URL } from "@/utils/constants";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaBus, FaHome, FaRoute, FaUserFriends } from "react-icons/fa";
import { toast } from "react-toastify";
import * as Yup from "yup";

const initialValues = {
    name: "",
    password: "",
  };
  const driverSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    password: Yup.string().required("Password is required"),
  });

export default function AdminLayout({ children }) {
    const { user, loading, error } = useAuthContext();
    const router = useRouter();
    useEffect(() => {
        if (!loading && user?.role !== "driver") {
            toast.error(`You are not authorized to access this panel${user.role}`);
            router.push("/");
        }
    }, [user, loading, router]);

    const navItems = [
      { href: "/driver/home", label: "Home", icon: FaHome },
      { href: "/driver/routes", label: "Routes", icon: FaRoute },
      { href: "/driver/trips", label: "Buses", icon: FaBus },
      { href: "/driver/profile", label: "Profile", icon: FaUserFriends },
    ];
    const [driverData,setDriverData]=useState(null);
    useEffect(()=>{
        setDriverData(JSON.parse(localStorage.getItem('driverData')))
    },[])
    const { isOpen, openModal, closeModal } = useModal();
    const handleSubmit = async(values) => {
        console.log(values);
        const response = await fetch(`${BASE_URL}/api/drivers/${values?.name}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        if (!response.ok) {
          toast.success('Could not log you in')
          throw new Error(`HTTP error! status: ${response.status}`);
        };
        toast.success('Successfully logged in');
        const jsonData = await response.json();
        setDriverData(jsonData)
        localStorage.setItem('driverData', JSON.stringify(jsonData));
        closeModal()
    };

    return (
        <div className="xl:flex h-screen">
            {!driverData ? (
                <Modal
                    isOpen={true}
                    onClose={closeModal}
                    className="max-w-[700px] p-6 lg:p-10"
                    showCloseButton={false}
                >
                    <FormWrapper
                        initialValues={initialValues}
                        validationSchema={driverSchema}
                        onSubmit={handleSubmit}
                        className="bg-white p-6 rounded-lg"
                        >
                        <Text className="text-primary text-center text-3xl mb-4 font-bold">
                            Confirm your Driver Account
                        </Text>
                        <FormField name="name" label="Name" type="text" placeholder="john" />
                        <FormField
                            name="password"
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                        />
                        <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
                            <button
                                onClick={closeModal}
                                type="button"
                                className="flex w-full justify-center rounded-lg border border-gray-300 bg-tertiary px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto"
                            >
                                Close
                            </button>
                            <button
                                type="submit"
                                className="bg-primary text-white px-4 py-2 rounded"
                            >
                                Confirm
                            </button>
                        </div>
                    </FormWrapper>
                </Modal>
                ):
                (
                    <>
                        {/* Sidebar */}
                        <DashboardSidebar navItems={navItems}/>
                        {/* Main Content Area */}
                        <div className={`flex-1 transition-all duration-300 ease-in-out`} >
                            <DriverHeader user={user}/>                
                            <div className="bg-base h-screen overflow-scroll">{children}</div>
                        </div>
                    </>
                )
            }
        </div>
    )
};