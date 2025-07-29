"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import DataTable from "@/components/DataTable";
import { FaPlus } from "react-icons/fa";
import { addIcon, deleteIcon, editIcon, warningIcon } from "@/components/ui/icons";
import debounce from "@/utils/debounce";
import { useFetch } from "@/hooks/useFetch";
import Container from "@/components/ui/Container";
import Text from "@/components/ui/Text";
import Modal from "@/components/ui/Modal";
import { useModal } from "@/hooks/useModal";
import { useMutation } from "@/hooks/useMutation";
import * as Yup from 'yup';
import { FormField, FormWrapper } from "@/components/ui/Form";

const driverInitialValues = {
  driver_name: '',
  mobile: '',
  id_number: '',
  email: ''
};

const driverSchema = Yup.object().shape({
  driver_name: Yup.string().required('Driver name is required'),
  mobile: Yup.string().required('Mobile is required'),
  id_number: Yup.string().required('ID number is required'),
  email: Yup.string().required('Email is required'),
});

export default function Drivers() {
  // const [drivers, setDrivers] = useState([
  //   {
  //     id: 1,
  //     name: "Peter Kamau",
  //     phone: "+254700000001",
  //     idNumber: "12345678",
  //     email: "peter@example.com",
  //     residence: "Nairobi",
  //     atWork: true,
  //     startTime: "08:00",
  //     endTime: "17:00",
  //     trips: 5,
  //     route: "Thika Road",
  //   },
  //   {
  //     id: 2,
  //     name: "Mary Otieno",
  //     phone: "+254700000002",
  //     idNumber: "87654321",
  //     email: "mary@example.com",
  //     residence: "Kitengela",
  //     atWork: false,
  //     startTime: "09:00",
  //     endTime: "16:00",
  //     trips: 3,
  //     route: "Mombasa Road",
  //   },
  // ]);

  // const [newDriver, setNewDriver] = useState({
  //   name: "",
  //   phone: "",
  //   idNumber: "",
  //   email: "",
  //   residence: "",
  // });

  // const handleAddDriver = () => {
  //   const driver = {
  //     ...newDriver,
  //     id: Date.now(),
  //     atWork: false,
  //     startTime: "",
  //     endTime: "",
  //     trips: 0,
  //     route: "-",
  //   };
  //   setDrivers((prev) => [...prev, driver]);
  //   setNewDriver({
  //     name: "",
  //     phone: "",
  //     idNumber: "",
  //     email: "",
  //     residence: "",
  //   });
  // };

  const handleEdit = (id) => alert(`Edit driver ${id}`);

  
  /****Drivers Fetch */
  const [query,setQuery]=useState('');
  const { data: drivers, loading: loadingDrivers, error: errorDrivers, refetch: refetchDrivers} = useFetch(`/api/drivers?query=${query}`);
  const debouncedSearch = debounce(refetchDrivers, 300);
  function handleSearch(event) {
    console.log('Searching for:', event.target.value);
    setQuery(event.target.value)
    debouncedSearch()
  };
  /****Driver Creation */
  const { isOpen, openModal, closeModal } = useModal();
  const { mutate: createNewDriver } = useMutation('/api/drivers');
  const handleCreateDriverForm=async(values)=>{
    console.log(values)    
    await createNewDriver(values).then(()=>{
      console.log(
        `Driver creation functionality is succcess`
      );
      closeModal();
      refetchDrivers()
    }).catch((err)=>{
      alert(err)
    });
  };
  /****Driver Deletion */
  const [driverToBeDeleted,setdriverToBeDeleted]=useState({});
  const { isOpen: deleteisOpen, openModal: deleteopenModal, closeModal : deletecloseModal} = useModal();
  const { mutate: deleteExistingDriver } = useMutation('','DELETE');
  const handleShowDeleteModal=(driver)=>{
    console.log('driver',driver);
    setdriverToBeDeleted(driver)
    deleteopenModal();
  };
  const handleDelete = async(id) => {
    if(id){
      await deleteExistingDriver({},`/api/drivers/${driverToBeDeleted?.id}`).then(()=>{
        console.log(
          `driver deleted functionality is succcess`
        );
        deletecloseModal();
        refetchDrivers()
      }).catch((err)=>{
        alert(err)
      });
    }
  };
  const columns = [
    { header: "Name", accessor: "driver_name" },
    { header: "Mobile", accessor: "mobile", render: ((driver) => (`${driver?.mobile ?? 'N/A'}`)) },
    { header: "ID Number", accessor: "idNumber", render: ((driver) => (`${driver?.id_number ?? 'N/A'}`)) },
    { header: "Email", accessor: "email", render: ((driver) => (`${driver?.email ?? 'N/A'}`)) },
    { header: "Trips Done", accessor: "trips", render: ((driver) => (`${driver?.bus?.length ?? 'N/A'}`)) },
    {
      header: "Actions",
      accessor: "actions",
      render: (id, row) => (
        <div className="flex space-x-2">
          <button
            // onClick={() => handleShowUpdateModal(id)}
            className="bg-tertiary text-dark p-1 rounded hover:bg-secondary flex flex-row gap-2 align-middle"
          >
            {editIcon('my-0','text-xl')}
            edit
          </button>
          <button
            onClick={() => handleShowDeleteModal(id)}
            className="bg-red-400 text-white p-1 rounded hover:bg-red-600 flex flex-row gap-2 align-middle text-md"
          >
            {deleteIcon('my-0','text-xl')}
            delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <Container className="flex flex-col p-4 h-screen">
      <Container className="flex flex-row justify-between align-middle">
        <Text className='text-4xl fw-bold' as='h1'>Drivers</Text>
        <Container className="flex flex-row gap-2">
          <input 
            type="search" 
            placeholder="search driver" 
            className="block min-w-0 grow py-1.5 pr-3 pl-1 bg-tertiary border-dark rounded-md text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
            onChange={((e)=>{handleSearch(e)})}
          />
          <button 
            className="bg-primary p-2 rounded-md text-white flex-row flex align-middle text-lg cursor-pointer" 
            type="button"
            onClick={()=>openModal()}
          >{addIcon('','',{marginTop:4})}new</button>
        </Container>
      </Container>
      <DataTable columns={columns} data={drivers}/>
      {/* Create driver Modal */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[700px] p-6 lg:p-10"
      >
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
          <div>
            <h5 className="mb-2 font-semibold text-dark modal-title lg:text-2xl">
              Create Driver
            </h5>
          </div>
          <FormWrapper
            initialValues={driverInitialValues}
            validationSchema={driverSchema}
            onSubmit={handleCreateDriverForm}
            className="w-full"
          >
            <FormField name="driver_name" label="Name" type="text" placeholder="John Doe" />
            <FormField name="mobile" label="Mobile" type="tel" placeholder="0700000000" />
            <FormField name="id_number" label="Id Number" type="text" placeholder="1234567" />
            <FormField name="email" label="Email" type="email" placeholder="johndoe@gmail.com" />
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
              > Save
              </button>
            </div>
          </FormWrapper>
        </div>
      </Modal>
      {/* Delete driver Modal */}
      <Modal
        isOpen={deleteisOpen}
        onClose={deletecloseModal}
        className="max-w-[700px] p-6 lg:p-10"
      >
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
          <div className="flex flex-row gap-2 align-middle">
            <div className="rounded-full p-4 bg-red-300">
              {warningIcon('text-white','text-2xl')}
            </div>
            <h5 className="mb-2 font-semibold text-dark modal-title lg:text-2xl text-center my-auto">
              Delete {driverToBeDeleted?.driver_name}
            </h5>
          </div>
          <div className="my-4">
            <p>Are you sure you want to delete this driver?</p>
            <p>This action cannot be undone.</p>
          </div>
          <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
            <button
              onClick={deletecloseModal}
              type="button"
              className="flex w-full justify-center rounded-lg border border-gray-300 bg-tertiary px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto"
            >
              Close
            </button>
            <button
              type="submit"
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={()=>{handleDelete(driverToBeDeleted?.id)}}
            > Delete
            </button>
          </div>
        </div>
      </Modal>
    </Container>
    // <div className="flex">
    //   <main className="flex-1 p-10 bg-gray-50 min-h-screen">

    //     {/* Add New Driver Form */}
    //     <div className="mb-6">
    //       <h2 className="text-xl font-bold mb-2">Add New Driver</h2>
    //       <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
    //         <input
    //           type="text"
    //           placeholder="Name"
    //           value={newDriver.name}
    //           onChange={(e) =>
    //             setNewDriver({ ...newDriver, name: e.target.value })
    //           }
    //           className="p-2 border rounded"
    //         />
    //         <input
    //           type="text"
    //           placeholder="Phone"
    //           value={newDriver.phone}
    //           onChange={(e) =>
    //             setNewDriver({ ...newDriver, phone: e.target.value })
    //           }
    //           className="p-2 border rounded"
    //         />
    //         <input
    //           type="text"
    //           placeholder="ID Number"
    //           value={newDriver.idNumber}
    //           onChange={(e) =>
    //             setNewDriver({ ...newDriver, idNumber: e.target.value })
    //           }
    //           className="p-2 border rounded"
    //         />
    //         <input
    //           type="email"
    //           placeholder="Email"
    //           value={newDriver.email}
    //           onChange={(e) =>
    //             setNewDriver({ ...newDriver, email: e.target.value })
    //           }
    //           className="p-2 border rounded"
    //         />
    //         <input
    //           type="text"
    //           placeholder="Residence"
    //           value={newDriver.residence}
    //           onChange={(e) =>
    //             setNewDriver({ ...newDriver, residence: e.target.value })
    //           }
    //           className="p-2 border rounded"
    //         />
    //         <button
    //           onClick={handleAddDriver}
    //           className="bg-green-600 text-white p-2 rounded hover:bg-green-700 flex items-center justify-center"
    //         >
    //           <FaPlus className="mr-2" /> Add Driver
    //         </button>
    //       </div>
    //     </div>

    //     {/* Drivers Table */}
    //     <DataTable columns={columns} data={drivers} />
    //   </main>
    // </div>
  );
}
