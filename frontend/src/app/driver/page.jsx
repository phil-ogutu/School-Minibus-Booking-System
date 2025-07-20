'use client'
import { FormField, FormWrapper } from '@/components/ui/Form';
import * as Yup from 'yup';
import Container from '@/components/ui/Container.js';
import Text from '@/components/ui/Text.js';
import { useRouter } from 'next/navigation';

export default function DriverLogin() {
  const router = useRouter();
  const initialValues = {
    name: '',
    password: '',
  };
  const driverSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    password: Yup.string().required('Password is required')
  })
  const handleSubmit=(values)=>{
    console.log(values)
    router.push('/driver/home')
  }
  return (
    <Container className="flex flex-col md:flex-row bg-gradient-gold h-screen">
      <Container className="flex flex-col justify-center items-center w-full md:w-1/2 bg-secondary md:bg-white h-full">
        <FormWrapper
          initialValues={initialValues}
          validationSchema={driverSchema}
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
        >
          <Text className="text-primary text-center text-3xl mb-4 font-bold">Driver Login</Text>
          <FormField name="name" label="Name" type="text" placeholder="john" />
          <FormField name="password" label="Password" type="password" placeholder="••••••••" />
          <button type="submit" className="bg-primary text-white px-4 py-2 rounded mt-4">
            Login
          </button>
        </FormWrapper>        
      </Container>

      <Container className="hidden md:flex flex-col justify-center items-center w-full md:w-1/2 bg-primary ">
        <Text className="text-dark text-xl">Some carousel goes here</Text>
      </Container>
      
    </Container>
  );
}