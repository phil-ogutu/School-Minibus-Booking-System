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
import { toast } from "react-toastify";

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
  /****Drivers Fetch */
  const [query,setQuery]=useState('');
  const [page,setPage]=useState(1);
  const { data: drivers, loading: loadingDrivers, error: errorDrivers, refetch: refetchDrivers} = useFetch(`/api/drivers?query=${query}&page=${page}`);
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
      toast.success(`${values.driver_name} created successfully`)
      closeModal();
      refetchDrivers()
    }).catch((err)=>{
      toast.error('Failed to create driver',err)
    });
  };
  /****Driver Update */
  const [driverToBeUpdated,setdriverToBeUpdated]=useState({});
  const { isOpen: isEditModalOpen, openModal: openEditModal, closeModal: closeEditModal } = useModal();
  const { mutate: editMutate, data: updatedDriver, loading: loadingUpdatingDriver, error: errorUpdatingDriver } = useMutation(``,'PATCH');
  const handleShowUpdateModal=(driver)=>{
    driverInitialValues.driver_name = driver.driver_name;
    driverInitialValues.email = driver.email;
    driverInitialValues.id_number = driver.id_number;
    driverInitialValues.mobile = driver.mobile;
    setdriverToBeUpdated(driver)
    openEditModal();
  };
  const handleUpdateDriverForm=async(values)=>{
    console.log(values);
    await editMutate(values,`/api/drivers/${driverToBeUpdated?.id}`).then(()=>{
      console.log(
        `Driver update functionality is succcess`
      );
      toast.success(`${values.driver_name} updated successfully`)
      closeEditModal();
      refetchDrivers()
    }).catch((err)=>{
      toast.error('Failed to update driver',err)
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
        toast.success(`${driverToBeDeleted.driver_name} deleted successfully`)
        deletecloseModal();
        refetchDrivers()
      }).catch((err)=>{
        toast.error('Failed to delete driver',err)
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
            onClick={() => handleShowUpdateModal(id)}
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
      <DataTable columns={columns} data={drivers} setPage={setPage} Page={page}/>
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
      {/* Update driver Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        className="max-w-[700px] p-6 lg:p-10"
      >
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
          <div>
            <h5 className="mb-2 font-semibold text-dark modal-title lg:text-2xl">
              Update Driver
            </h5>
          </div>
          <FormWrapper
            initialValues={driverInitialValues}
            validationSchema={driverSchema}
            onSubmit={handleUpdateDriverForm}
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
  );
}
