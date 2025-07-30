"use client";

import { useState } from 'react';
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
import dynamic from 'next/dynamic';  // Dynamically import CreateBooking to avoid SSR issues

const ViewBookings = () => {
  const [query,setQuery]=useState('');
  const { deleteExistingBooking } = useBookings();
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

  // const handleDelete = async (bookingId) => {
  //   const confirmation = window.confirm('Are you sure you want to delete this booking?');
  //   if (confirmation) {
  //     await deleteExistingBooking(bookingId);
  //   }
  // };

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
      await deleteExistingBooking(bookingToBeDeleted?DataTable.id).then(()=>{
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
              // onClick={()=>openModal()}
            >{addIcon('','',{marginTop:4})}new</button>
          </Container>
        </Container>
      <DataTable columns={columns} data={bookings}/>
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

