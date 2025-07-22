import Container from '@/components/ui/Container'
import Text from '@/components/ui/Text'
import React from 'react'
import {Header as DriverHeader} from '../components/Header'
import Image from 'next/image'
import RouteCard from '../components/route'

function page() {
  const routes = [

  ]
  return (
    <Container className={'flex-col'}>
        <DriverHeader/>
        <Container className='p-4' >
          <Text className='text-3xl mb-4'>Welcome Back, John</Text>
          <img src={'/banners/kids.jpg'} style={{width:'100%',height:'400px',objectFit:'cover',borderRadius:'10px'}}/>
        </Container>
        <Container className='flex flex-row px-4 gap-4 text-center'>
          <Text className='p-1 bg-dark rounded-full w-25 align-middle text-white'>Today</Text>
          <Text className='p-1 bg-secondary rounded-full w-50 align-middle '>Tomorrow</Text>
          <Text className='p-1 bg-secondary rounded-full w-50 align-middle '>Completed</Text>
        </Container>
        <Container className='flex flex-row flex-wrap p-4'>
          {Array.from({length:10}).map((_,i)=>{
            return (<RouteCard key={i} index={i}/>)
          })}
        </Container>
    </Container>
  )
}

export default page
