"use client";

import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useBuses } from "@/hooks/useBuses";
import EditBusModal from "@/components/EditBusModal"; // Import the modal
import { ClipLoader } from 'react-spinners';
import Container from "@/components/ui/Container";
import Text from "@/components/ui/Text";
import { addIcon, deleteIcon, editIcon, warningIcon } from "@/components/ui/icons";
import DataTable from "@/components/DataTable";
import debounce from "@/utils/debounce";
import Modal from "@/components/ui/Modal";
import { FormField, FormWrapper } from "@/components/ui/Form";
import { Field } from "formik";
import * as Yup from 'yup';
import { useModal } from "@/hooks/useModal";
import { useFetch } from "@/hooks/useFetch";
import { useRoutes } from "@/hooks/useRoutes";

const busInitialValues = {
  plate: '',
  capacity: '',
  driver_id: '',
  route_id: '',
  owner_id: '',
  departure: '',
};

const busSchema = Yup.object().shape({
  plate: Yup.string().required('Plate number is required'),
  capacity: Yup.number().min(1).required('Bus capacity is required'),
  driver_id: Yup.number().required('Driver is required'),
  route_id: Yup.number().required('Route is required'),
  owner_id: Yup.number().required('Owner is required'),
  departure: Yup.date().required('Departure is required'),
});

export default function ManageBuses() {
  const [query,setQuery]=useState('');
  const { createNewBus, deleteExistingBus, fetchBuses, updateExistingBus } = useBuses();
  const { data: buses, loading: loadingBuses, error: errorBuses, refetch: refetchBuses} = useFetch(`/api/buses?query=${query}`);
  const { data: drivers} = useFetch('/api/drivers');
  const { data: owners} = useFetch('/api/owners');
  const { routes } = useRoutes()
  /****Buses Fetch */
  const debouncedSearch = debounce(refetchBuses, 300);
  function handleSearch(event) {
    console.log('Searching for:', event.target.value);
    setQuery(event.target.value)
    debouncedSearch()
  };
  const { isOpen, openModal, closeModal } = useModal();
  /****Bus Creation */
  const handleCreateBusForm=async(values)=>{
    console.log(values)    
    await createNewBus(values).then(()=>{
      console.log(
        `Bus creation functionality is succcess`
      );
      closeModal();
      refetchBuses()
    }).catch((err)=>{
      alert(err)
    });
  };
  /****Bus Deletion */
  const [busToBeDeleted,setbusToBeDeleted]=useState({});
  const { isOpen: deleteisOpen, openModal: deleteopenModal, closeModal : deletecloseModal} = useModal();
  const handleShowDeleteModal=(bus)=>{
    console.log('bus',bus);
    setbusToBeDeleted(bus)
    deleteopenModal();
  };
  const handleDelete = async(id) => {
    if(id){
      await deleteExistingBus(busToBeDeleted?.id).then(()=>{
        console.log(
          `bus deleted functionality is succcess`
        );
        deletecloseModal();
        refetchBuses()
      }).catch((err)=>{
        alert(err)
      });
    }
  };
  const columns = [
    { header: "Route", accessor: "routesz", render: ((bus) => (`${bus?.routes?.start ?? 'no routes'}`)) },
    { header: "Plate", accessor: "plate" },
    { header: "Booked/Capacity", accessor: "booked/capacity", render: ((bus) => (`${bus?.bookings?.length}/${bus.capacity}`)) },
    { header: "Driver", accessor: "driverassigned", render: ((bus) => (`${bus?.driver?.driver_name}`)) },
    { header: "Departure", accessor: "departure" },
    { header: "Arrived", accessor: "arrived", render: ((bus) => (`${bus?.arrived ?? 'pending'}`)) },
    { header: "Status", accessor: "status", render: ((bus) => (`${bus?.status}`)) },
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
  return(
      <Container className="flex flex-col p-4 h-screen">
        <Container className="flex flex-row justify-between align-middle">
          <Text className='text-4xl fw-bold' as='h1'>Buses</Text>
          <Container className="flex flex-row gap-2">
            <input 
              type="search" 
              placeholder="search buses" 
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
        <DataTable columns={columns} data={buses}/>
        {/* Create user Modal */}
        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          className="max-w-[700px] p-6 lg:p-10"
        >
          <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
            <div>
              <h5 className="mb-2 font-semibold text-dark modal-title lg:text-2xl">
                Create Bus
              </h5>
            </div>
            <FormWrapper
              initialValues={busInitialValues}
              validationSchema={busSchema}
              onSubmit={handleCreateBusForm}
              className="w-full"
            >
              <FormField name="plate" label="Plate" type="text" placeholder="KCB 000A" />
              <FormField name="capacity" label="Capacity" type="number" placeholder="30" />
              <div className='flex flex-col my-2'>
                <label htmlFor="driver_id">Choose a driver:</label>
                <Field as="select" name="driver_id" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {drivers && drivers?.map((driver)=>{
                    return(
                      <option key={driver?.id} value={driver?.id}>{driver?.driver_name}</option>
                    )
                  })}
                </Field>
              </div>
              <div className='flex flex-col my-2'>
                <label htmlFor="route_id">Choose an route:</label>
                <Field as="select" name="route_id" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {routes && routes?.map((route)=>{
                    return(
                      <option key={route?.id} value={route?.id}>{route?.start} to {route?.end}</option>
                    )
                  })}
                </Field>
              </div>
              <div className='flex flex-col my-2'>
              <label htmlFor="owner_id">Choose an owner:</label>
              <Field as="select" name="owner_id"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {owners && owners?.map((owner)=>{
                  return(
                    <option key={owner?.id} value={owner?.id}>{owner?.owner_name}</option>
                  )
                })}
              </Field>
              </div>
              <FormField name="departure" label="Departure" type="datetime-local" placeholder="date"/>
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
        {/* Delete user Modal */}
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
                Delete bus of {busToBeDeleted?.plate}
              </h5>
            </div>
            <div className="my-4">
              <p>Are you sure you want to delete this bus?</p>
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
                onClick={()=>{handleDelete(busToBeDeleted?.id)}}
              > Delete
              </button>
            </div>
          </div>
        </Modal>
      </Container>
  );
}
