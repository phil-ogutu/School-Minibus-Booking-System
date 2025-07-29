"use client";

import { useEffect, useState } from 'react';
import { useBookings } from '@/hooks/useBookings';
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import CreateBooking from "@/components/CreateBooking";
import UpdateBookingForm from '@/components/UpdateBooking';
import DataTable from "@/components/DataTable"; // Import DataTable
import { addIcon, deleteIcon, editIcon, warningIcon } from '@/components/ui/icons';
import Container from '@/components/ui/Container';
import Text from '@/components/ui/Text';
import { useModal } from '@/hooks/useModal';
import debounce from '@/utils/debounce';
import { useFetch } from '@/hooks/useFetch';
import Modal from '@/components/ui/Modal';
import { FormField, FormWrapper } from '@/components/ui/Form';
import { FaCreditCard, FaMapMarkerAlt } from 'react-icons/fa';
import { Field, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { calculatePrice, haversineDistance } from '@/utils/distance';

const bookingInitialValues = {
  parent_id: '',
  bus_id: '',
  title: 'new Booking',
  child_name: '',
  pickup: '',
  dropoff: '',
  price: 0,
};

const bookingSchema = Yup.object().shape({
  parent_id: Yup.number().required('Parent is required'),
  bus_id: Yup.number().required('Bus is required'),
  title: Yup.string().required('Booking title is required'),
  child_name: Yup.string().required('Child name is required'),
  pickup: Yup.string().required('Pick up is required'),
  dropoff: Yup.string().required('Drop Off is required'),
  price: Yup.number().required('Driver is required'),
});

const ViewBookings = () => {
  const [query,setQuery]=useState('');
  const { createNewBooking, deleteExistingBooking } = useBookings();
  const [allowEditing, setAllowEditng] = useState(false)
  const [editingBookingId, setEditingBookingId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateBooking = () => {
    setIsCreating(true);
  };

  const handleEdit = (bookingId) => {
    setAllowEditng(true)
    if (bookingId) {
      setEditingBookingId(bookingId);
    }
  };

  const handleCloseModal = () => {
    setIsCreating(false);
    setEditingBookingId(null);
  };
  /****Bookings Fetch */
  const { data: bookings, loading: loadingBookings, error: errorBookings, refetch: refetchBookings} = useFetch(`/api/bookings?query=${query}`);
  
  const debouncedSearch = debounce(refetchBookings, 300);
  function handleSearch(event) {
    console.log('Searching for:', event.target.value);
    setQuery(event.target.value)
    debouncedSearch()
  };
  /****Booking Creation */
  const { isOpen, openModal, closeModal } = useModal();
  const handleCreateBookingForm=async(values)=>{
    console.log(values)    
    await createNewBooking(values).then(()=>{
      console.log(
        `Booking creation functionality is succcess`
      );
      closeModal();
      refetchBookings()
    }).catch((err)=>{
      alert(err)
    });
  };
  /****Booking Deletion */
  const [bookingToBeDeleted,setbookingToBeDeleted]=useState({});
  const { isOpen: deleteisOpen, openModal: deleteopenModal, closeModal : deletecloseModal} = useModal();
  const handleShowDeleteModal=(booking)=>{
    console.log('booking',booking);
    setbookingToBeDeleted(booking)
    deleteopenModal();
  };
  const handleDelete = async(id) => {
    if(id){
      await deleteExistingBooking(bookingToBeDeleted?.id).then(()=>{
        console.log(
          `booking deleted functionality is succcess`
        );
        deletecloseModal();
        refetchBookings()
      }).catch((err)=>{
        alert(err)
      });
    }
  };
  const { data: parents, loading: loadingParents, error: errorParents, refetch: refetchParents} = useFetch(`/api/users/parent`);
  const { data: buses, loading: loadingBuses, error: errorBuses, refetch: refetchBuses} = useFetch(`/api/buses`);

  const columns = [
    { header: "Student", accessor: "child_name" },
    { header: "Parent", accessor: "parent?.username", render: ((booking) => (`${booking?.parent?.username}`)) },
    { header: "Bus", accessor: "bus?.plate ",render: ((booking) => (`${booking?.bus?.plate}`)) },
    { header: "Pickup", accessor: "pickup" },
    { header: "Drop-off", accessor: "dropoff" },
    { header: "Price", accessor: "price" },
    { header: "Status", accessor: "status", render: (status) => status ? 'Active' : 'Inactive' },
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
          <Text className='text-4xl fw-bold' as='h1'>Bookings</Text>
          <Container className="flex flex-row gap-2">
            <input 
              type="search" 
              placeholder="search bookings" 
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
      <DataTable columns={columns} data={bookings}/>
      {/* Create Booking Modal */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[700px] p-6 lg:p-10"
      >
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
          <div>
            <h5 className="mb-2 font-semibold text-dark modal-title lg:text-2xl">
              Create Booking
            </h5>
          </div>
          <FormWrapper
            initialValues={bookingInitialValues}
            validationSchema={bookingSchema}
            onSubmit={handleCreateBookingForm}
            className="w-full"
          >
            <div className='flex flex-col my-2'>
              <label htmlFor="bus_id">Choose a Bus:</label>
              <Field as="select" name="bus_id" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {buses && buses?.map((bus)=>{
                  return(
                    <option key={bus?.id} value={bus?.id}>{bus?.routes?.start}{bus?.routes?.end}</option>
                  )
                })}
              </Field>
            </div>
            <div className='flex flex-col my-2'>
              <label htmlFor="parent_id">Choose a Parent:</label>
              <Field as="select" name="parent_id" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {parents && parents?.map((parent)=>{
                  return(
                    <option key={parent?.id} value={parent?.id}>{parent?.username}</option>
                  )
                })}
              </Field>
            </div>
            <FormField name="child_name" label="Child Name" type="text" placeholder="Enter child name here..." />
            <PickupDropoffFields buses={buses} />
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
      {/* Delete booking Modal */}
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
              Delete booking for {bookingToBeDeleted?.child_name}
            </h5>
          </div>
          <div className="my-4">
            <p>Are you sure you want to delete this booking?</p>
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
              onClick={()=>{handleDelete(bookingToBeDeleted?.id)}}
            > Delete
            </button>
          </div>
        </div>
      </Modal>
    </Container>
  );
};

export default ViewBookings;


const PickupDropoffFields = ({ buses }) => {
  const { values, setFieldValue } = useFormikContext();

  const selectedBus = buses.find(bus => bus.id == values?.bus_id);
  const locations = selectedBus?.routes?.locations || [];

  const pickupIndex = locations.findIndex(
    (loc) => loc.location_name === values.pickup
  );

  const [price, setPrice] = useState(0);

  useEffect(() => {
    if (values.pickup && values.dropoff && locations.length > 0) {
      const pickupLoc = locations.find(
        (loc) => loc.location_name === values.pickup
      );
      const dropoffLoc = locations.find(
        (loc) => loc.location_name === values.dropoff
      );

      if (pickupLoc && dropoffLoc) {
        const distance = haversineDistance(
          { lat: pickupLoc.latitude, lng: pickupLoc.longitude },
          { lat: dropoffLoc.latitude, lng: dropoffLoc.longitude }
        );
        const computedPrice = calculatePrice(distance);
        setPrice(computedPrice.toFixed(2));
        setFieldValue('price', parseFloat(computedPrice.toFixed(2)));
      }
    }
  }, [values.pickup, values.dropoff, locations, setFieldValue]);

  return (
    <>
      <label className="block mb-2 flex gap-2 items-center">
        <FaMapMarkerAlt />
        Pickup Location
      </label>
      <Field
        as="select"
        name="pickup"
        className="w-full p-2 mb-4 border rounded-lg border-neutral-400 focus:outline-none text-neutral-600"
        onChange={(e) => {
          setFieldValue('pickup', e.target.value);
          setFieldValue('dropoff', ''); // reset dropoff when pickup changes
        }}
        disabled={!selectedBus}
      >
        <option value="">Select Pickup</option>
        {locations.map((location) => (
          <option key={location.id} value={location.location_name}>
            {location.location_name}
          </option>
        ))}
      </Field>

      <label className="block mb-2 flex gap-2 items-center">
        <FaMapMarkerAlt />
        Dropoff Location
      </label>
      <Field
        as="select"
        name="dropoff"
        className="w-full p-2 mb-4 border rounded-lg border-neutral-400 focus:outline-none text-neutral-600"
        disabled={!selectedBus || !values.pickup}
      >
        <option value="">Select Dropoff</option>
        {locations.map((location, idx) => (
          <option
            key={location.id}
            value={location.location_name}
            disabled={pickupIndex >= 0 && idx <= pickupIndex}
          >
            {location.location_name}
          </option>
        ))}
      </Field>
      {price > 0 && (
        <div className="h-10 mb-5 p-4 rounded-md">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <FaCreditCard /> Total price
            </div>
            <span>Ksh {price}</span>
          </div>
        </div>
      )}
    </>
  );
};