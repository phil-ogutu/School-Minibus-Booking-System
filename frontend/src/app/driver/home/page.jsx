'use client'
import Container from '@/components/ui/Container'
import Text from '@/components/ui/Text'
import React from 'react';
import TripCard from '../components/trip'
import { useFetch } from '@/hooks/useFetch'

function page() {
  const driverData = JSON.parse(localStorage.getItem('driverData'))
  const { data: trips, loading: tripsLoading, error: tripsError } = useFetch(`/api/drivers/${driverData?.id}/trips`);
  return (
    <Container className={'flex-col'}>
        <Container className='p-4' >
          <Text className='text-3xl mb-4'>Welcome Back, {driverData?.driver_name ??'John'}</Text>
          <img src={'/banners/kids.jpg'} style={{width:'100%',height:'400px',objectFit:'cover',borderRadius:'10px'}}/>
        </Container>
        <Container className='flex flex-row px-4 gap-4 text-center'>
          <Text className='p-1 bg-dark rounded-full w-25 align-middle text-white'>Today</Text>
          <Text className='p-1 bg-secondary rounded-full w-50 align-middle '>Tomorrow</Text>
          <Text className='p-1 bg-secondary rounded-full w-50 align-middle '>Completed</Text>
        </Container>
        <Container className='flex flex-row flex-wrap p-4'>
          {!tripsLoading && trips?.map((trip,i)=>{
            return (<TripCard trip={trip} key={trip?.id} index={i}/>)
          })}
        </Container>
    </Container>
  )
}

export default page;