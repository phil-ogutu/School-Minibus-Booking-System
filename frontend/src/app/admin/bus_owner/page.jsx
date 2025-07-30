"use client";

import { useState } from "react";
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

const ownerInitialValues = {
  owner_name: '',
};

const ownerSchema = Yup.object().shape({
  owner_name: Yup.string().required('Owner name is required'),
});

export default function Owners() {  
  /****Owners Fetch */
  const [query,setQuery]=useState('');
  const { data: owners, loading: loadingOwners, error: errorOwners, refetch: refetchOwners} = useFetch(`/api/owners?query=${query}`);
  const debouncedSearch = debounce(refetchOwners, 300);
  function handleSearch(event) {
    console.log('Searching for:', event.target.value);
    setQuery(event.target.value)
    debouncedSearch()
  };
  /****Owner Creation */
  const { isOpen, openModal, closeModal } = useModal();
  const { mutate: createNewOwner } = useMutation('/api/owners');
  const handleCreateOwnerForm=async(values)=>{
    console.log(values)    
    await createNewOwner(values).then(()=>{
      console.log(
        `Owner creation functionality is succcess`
      );
      closeModal();
      refetchOwners()
    }).catch((err)=>{
      alert(err)
    });
  };
  /****Owner Update */
  const [ownerToBeUpdated,setownerToBeUpdated]=useState({});
  const { isOpen: isEditModalOpen, openModal: openEditModal, closeModal: closeEditModal } = useModal();
  const { mutate: editMutate, data: updatedOwner, loading: loadingUpdatingOwner, error: errorUpdatingOwner } = useMutation(``,'PATCH');
  const handleShowUpdateModal=(owner)=>{
    ownerInitialValues.owner_name = owner.owner_name;
    setownerToBeUpdated(owner)
    openEditModal();
  };
  const handleUpdateOwnerForm=async(values)=>{
    console.log(values);
    await editMutate(values,`/api/owners/${ownerToBeUpdated?.id}`).then(()=>{
      console.log(
        `Owner update functionality is succcess`
      );
      closeEditModal();
      refetchOwners()
    }).catch((err)=>{
      alert(err)
    });
  };
  /****Owner Deletion */
  const [ownerToBeDeleted,setownerToBeDeleted]=useState({});
  const { isOpen: deleteisOpen, openModal: deleteopenModal, closeModal : deletecloseModal} = useModal();
  const { mutate: deleteExistingOwner } = useMutation('','DELETE');
  const handleShowDeleteModal=(owner)=>{
    console.log('owner',owner);
    setownerToBeDeleted(owner)
    deleteopenModal();
  };
  const handleDelete = async(id) => {
    if(id){
      await deleteExistingOwner({},`/api/owners/${ownerToBeDeleted?.id}`).then(()=>{
        console.log(
          `owner deleted functionality is succcess`
        );
        deletecloseModal();
        refetchOwners()
      }).catch((err)=>{
        alert(err)
      });
    }
  };
  const columns = [
    { header: "Name", accessor: "owner_name" },
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
        <Text className='text-4xl fw-bold' as='h1'>Owners</Text>
        <Container className="flex flex-row gap-2">
          <input 
            type="search" 
            placeholder="search owners" 
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
      <DataTable columns={columns} data={owners}/>
      {/* Create owner Modal */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[700px] p-6 lg:p-10"
      >
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
          <div>
            <h5 className="mb-2 font-semibold text-dark modal-title lg:text-2xl">
              Create Owner
            </h5>
          </div>
          <FormWrapper
            initialValues={ownerInitialValues}
            validationSchema={ownerSchema}
            onSubmit={handleCreateOwnerForm}
            className="w-full"
          >
            <FormField name="owner_name" label="Name" type="text" placeholder="John Doe" />
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
      {/* Update owner Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        className="max-w-[700px] p-6 lg:p-10"
      >
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
          <div>
            <h5 className="mb-2 font-semibold text-dark modal-title lg:text-2xl">
              Update Owner
            </h5>
          </div>
          <FormWrapper
            initialValues={ownerInitialValues}
            validationSchema={ownerSchema}
            onSubmit={handleUpdateOwnerForm}
            className="w-full"
          >
            <FormField name="owner_name" label="Name" type="text" placeholder="John Doe" />
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
      {/* Delete owner Modal */}
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
              Delete {ownerToBeDeleted?.owner_name}
            </h5>
          </div>
          <div className="my-4">
            <p>Are you sure you want to delete this bus owner?</p>
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
              onClick={()=>{handleDelete(ownerToBeDeleted?.id)}}
            > Delete
            </button>
          </div>
        </div>
      </Modal>
    </Container>
  );
}
