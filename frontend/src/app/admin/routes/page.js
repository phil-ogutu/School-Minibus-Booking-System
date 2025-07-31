"use client";

import { useState, useEffect } from "react";
import { useRoutes } from "@/hooks/useRoutes";
import { addIcon, deleteIcon, editIcon, warningIcon } from "@/components/ui/icons";
import Container from "@/components/ui/Container";
import Text from "@/components/ui/Text";
import debounce from "@/utils/debounce";
import DataTable from "@/components/DataTable";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import { useModal } from "@/hooks/useModal";
import { toast } from "react-toastify";

export default function ManageRoutes() {
  const router = useRouter();
  /****Routes Fetch */
  const [query,setQuery]=useState('');
    const [page,setPage]=useState(1);
  const { routes, routesLoading, routesError, creating, updating, deleting, createNewRoute, deleteExistingRoute, fetchRoutes, updateExistingRoute } = useRoutes(`/api/routes?query=${query}&page=${page}`);
  const debouncedSearch = debounce(fetchRoutes, 300);
  function handleSearch(event) {
    console.log('Searching for:', event.target.value);
    setQuery(event.target.value)
    debouncedSearch()
  };
  /****Routes Deletion */
  const [routeToBeDeleted,setrouteToBeDeleted]=useState({});
  const { isOpen: deleteisOpen, openModal: deleteopenModal, closeModal : deletecloseModal} = useModal();
  const handleShowDeleteModal=(route)=>{
    console.log('route',route);
    setrouteToBeDeleted(route)
    deleteopenModal();
  };
  const handleDelete = async(id) => {
    if(id){
      await deleteExistingRoute(routeToBeDeleted?.id).then(()=>{
        console.log(
          `Route deleted functionality is succcess`
        );
        deletecloseModal();
        fetchRoutes();
        toast.success(`${routeToBeDeleted.start} deleted successfully`)
      }).catch((err)=>{
        alert(err)
      });
    }
  };

  const columns = [
    { header: "Start", accessor: "start" },
    { header: "End", accessor: "end" },
    { header: "Stops", accessor: "stops", render: ((route) => (`${route?.locations?.length}`)) },
    { header: "Status", accessor: "status" },
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
        <Text className='text-4xl fw-bold' as='h1'>Routes</Text>
        <Container className="flex flex-row gap-2">
          <input 
            type="search" 
            placeholder="search routes" 
            className="block min-w-0 grow py-1.5 pr-3 pl-1 bg-tertiary border-dark rounded-md text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
            onChange={((e)=>{handleSearch(e)})}
          />
          <button 
            className="bg-primary p-2 rounded-md text-white flex-row flex align-middle text-lg cursor-pointer" 
            type="button"
            onClick={()=>router.push('/admin/routes/new')}
          >{addIcon('','',{marginTop:4})}new</button>
        </Container>
      </Container>
      <DataTable columns={columns} data={routes} setPage={setPage} Page={page}/>
      {/* Delete route Modal */}
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
              Delete {routeToBeDeleted?.start} - {routeToBeDeleted?.end}
            </h5>
          </div>
          <div className="my-4">
            <p>Are you sure you want to delete this route?</p>
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
              onClick={()=>{handleDelete(routeToBeDeleted?.id)}}
            > Delete
            </button>
          </div>
        </div>
      </Modal>
    </Container>
  )
}
