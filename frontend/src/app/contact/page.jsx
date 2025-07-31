"use client"
import Navbar from '@/components/Navbar';
import ContactUs from '@/components/ui/ContactUs'
import React from 'react'

function page() {
  return (
    <div className="min-h-screen flex flex-col">
        <Navbar />
        <ContactUs/>
    </div>
  )
}

export default page;