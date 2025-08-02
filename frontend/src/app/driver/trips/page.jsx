'use client'
import Container from '@/components/ui/Container'
import Text from '@/components/ui/Text'
import React, { useEffect, useState } from 'react'
import TripCard from '../components/trip';
import { useFetch } from '@/hooks/useFetch';

function page() {
    const [driverData,setDriverDate]=useState(null);
    useEffect(()=>{
        setDriverDate(JSON.parse(localStorage.getItem('driverData')))
    },[])
    const [query,setQuery]=useState('');
    const { data: trips, loading: tripsLoading, error: tripsError } = useFetch(`/api/drivers/${driverData?.id}/trips`);

    return (
        <Container className="flex flex-col p-4 h-screen">
            <Container className="flex flex-row justify-between align-middle">
                <Text className='text-4xl fw-bold' as='h1'>Trips</Text>
                <Container className="flex flex-row gap-2">
                <input 
                    type="search" 
                    placeholder="search buses by plate" 
                    className="block min-w-0 grow py-1.5 pr-3 pl-1 bg-tertiary border-dark rounded-md text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                    // onChange={((e)=>{handleSearch(e)})}
                />
                </Container>
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