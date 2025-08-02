import React from 'react';
import Logo from '@/components/Logo';
import Container from '@/components/ui/Container';
import Text from '@/components/ui/Text';
import { accountIcon, notificationIcon } from '@/components/ui/icons';
import { theme } from '@/components/ui/theme';
import Link from 'next/link';
import { ProfileCard } from '@/components/Navbar'

export function Header({user}) {
  return (
    <Container className='flex flex-row align-middle justify-between w-full px-4 border-b border-b-slate-200'>
      <Text className='text-3xl my-auto'>Home</Text>
      {user && (
        <ProfileCard name={user?.username} email={user?.email} role={user?.role}/>
      )}
    </Container>
  )
};