"use client";

import { useState } from "react";
import DataTable from "@/components/DataTable";
import Container from "@/components/ui/Container";
import Text from "@/components/ui/Text";
import { addIcon, deleteIcon, editIcon, warningIcon } from "@/components/ui/icons";
import { useFetch } from "@/hooks/useFetch";
import debounce from "@/utils/debounce";
import { useModal } from "@/hooks/useModal";
import Modal from "@/components/ui/Modal";
import { FormField, FormWrapper } from "@/components/ui/Form";
import * as Yup from 'yup';
import { useMutation } from "@/hooks/useMutation";
import { toast } from "react-toastify";

const parentInitialValues = {
  username: '',
  email: '',
  mobile: '',
  password: 'password',
  role: 'parent',
};

const parentSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  email: Yup.string().required('Email is required'),
  mobile: Yup.string().required('Mobile is required'),
  password: Yup.string().required('Password is required'),
  role: Yup.string().required('role').default('parent')
})

export default function Parents() {
  /****User Fetch */
  const [query,setQuery]=useState('');
  const [page,setPage]=useState(1);
  const { data: parents, loading: loadingParents, error: errorParents, refetch: refetchParents} = useFetch(`/api/users/parent?query=${query}&page=${page}`);
  const debouncedSearch = debounce(refetchParents, 300);
  function handleSearch(event) {
    console.log('Searching for:', event.target.value);
    setQuery(event.target.value)
    debouncedSearch()
  };

  /****User Creation */
  const { isOpen, openModal, closeModal } = useModal();
  const { mutate, data: createdParent, loading: loadingCreatingParent, error: errorCreatingParent } = useMutation(`/api/users/parent`);
  const handleCreateUserModal=()=>{
    openModal();
  };
  const handleCreateUserForm=async(values)=>{
    console.log(values)    
    await mutate(values).then(()=>{
      console.log(
        `Parent creation functionality is succcess`
      );
      toast.success(`${values.username} created successfully`)
      closeModal();
      refetchParents()
    }).catch((err)=>{
      alert(err)
    });
  };
    /****User Update */
  const [userToBeUpdated,setuserToBeUpdated]=useState({});
  const { isOpen: isEditModalOpen, openModal: openEditModal, closeModal: closeEditModal } = useModal();
  const { mutate: editMutate, data: updatedParent, loading: loadingUpdatingParent, error: errorUpdatingParent } = useMutation(``,'PATCH');
  const handleShowUpdateModal=(parent)=>{
    parentInitialValues.email = parent.email;
    parentInitialValues.username = parent.username;
    parentInitialValues.mobile = parent.mobile;
    setuserToBeUpdated(parent)
    openEditModal();
  };
  const handleUpdateUserForm=async(values)=>{
    console.log(values)
    const payload = {
      email: values?.email,
      mobile: values?.mobile,
      username: values?.username,
    }  
    await editMutate(payload,`/api/users/${userToBeUpdated?.id}`).then(()=>{
      console.log(
        `Parent update functionality is succcess`
      );
      toast.success(`${values.username} updated successfully`);
      closeEditModal();
      refetchParents()
    }).catch((err)=>{
      alert(err)
    });
  };
  /****User Deletion */
  const [userToBeDeleted,setuserToBeDeleted]=useState({});
  const { isOpen: deleteisOpen, openModal: deleteopenModal, closeModal : deletecloseModal} = useModal();
  const handleShowDeleteModal=(parent)=>{
    console.log('parent',parent);
    setuserToBeDeleted(parent)
    deleteopenModal();
  };
  const { mutate: deleteParent, error: errorDeletingParent } = useMutation(``,'DELETE');
  const handleDelete = async(id) => {
    if(id){
      await deleteParent({},`/api/users/${userToBeDeleted?.id}`).then(()=>{
        console.log(
          `Parent deleted functionality is succcess`
        );
        toast.success(`${userToBeDeleted.username} deleted successfully`)
        deletecloseModal();
        refetchParents()
      }).catch((err)=>{
        toast.error(err)
      });
    }
  };

  const columns = [
    { header: "Parent Name", accessor: "username" },
    { header: "Email", accessor: "email" },
    { header: "Mobile", accessor: "mobile" },
    { header: "Status", accessor: "status" },
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
  return(
    <Container className="flex flex-col p-4 h-screen">
      <Container className="flex flex-row justify-between align-middle">
        <Text className='text-4xl fw-bold' as='h1'>Parents</Text>
        <Container className="flex flex-row gap-2">
          <input 
            type="search" 
            placeholder="search parents" 
            className="block min-w-0 grow py-1.5 pr-3 pl-1 bg-tertiary border-dark rounded-md text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
            onChange={((e)=>{handleSearch(e)})}
          />
          <button 
            className="bg-primary p-2 rounded-md text-white flex-row flex align-middle text-lg cursor-pointer" 
            type="button"
            onClick={()=>handleCreateUserModal()}
          >{addIcon('','',{marginTop:4})}new</button>
        </Container>
      </Container>
      <DataTable columns={columns} data={parents} setPage={setPage} Page={page}/>
      {/* Create user Modal */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[700px] p-6 lg:p-10"
      >
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
          <div>
            <h5 className="mb-2 font-semibold text-dark modal-title lg:text-2xl">
              Create Parent
            </h5>
          </div>
          <FormWrapper
            initialValues={parentInitialValues}
            validationSchema={parentSchema}
            onSubmit={handleCreateUserForm}
            className="w-full"
          >
            <FormField name="username" label="Name" type="text" placeholder="john doe" />
            <FormField name="email" label="Email" type="email" placeholder="johndoe@gmail.com" />
            <FormField name="mobile" label="Mobile" type="tel" placeholder="0759233322" />
            <FormField name="role" label="Role" type="text" placeholder="parent" disabled={true}/>
            <FormField name="password" label="Password" type="password" placeholder="••••••••" disabled={true}/>
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
      {/* Update user Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        className="max-w-[700px] p-6 lg:p-10"
      >
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
          <div>
            <h5 className="mb-2 font-semibold text-dark modal-title lg:text-2xl">
              Update Parent
            </h5>
          </div>
          <FormWrapper
            initialValues={parentInitialValues}
            validationSchema={parentSchema}
            onSubmit={handleUpdateUserForm}
            className="w-full"
          >
            <FormField name="username" label="Name" type="text" placeholder="john doe" />
            <FormField name="email" label="Email" type="email" placeholder="johndoe@gmail.com" />
            <FormField name="mobile" label="Mobile" type="tel" placeholder="johndoe@gmail.com" />
            <FormField name="role" label="Role" type="text" placeholder="parent" disabled={true}/>
            <FormField name="password" label="Password" type="password" placeholder="••••••••" disabled={true}/>
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
              Delete {userToBeDeleted?.username}
            </h5>
          </div>
          <div className="my-4">
            <p>Are you sure you want to delete this parent?</p>
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
              onClick={()=>{handleDelete(userToBeDeleted?.id)}}
            > Delete
            </button>
          </div>
        </div>
      </Modal>
    </Container>
  )
}