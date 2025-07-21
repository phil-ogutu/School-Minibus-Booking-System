import React from 'react';
import Logo from '@/components/Logo';
import Container from '@/components/ui/Container';
import Text from '@/components/ui/Text';
import { accountIcon, notificationIcon } from '@/components/ui/icons';
import { theme } from '@/components/ui/theme';

export function Header() {
  return (
    <Container className='flex flex-row align-middle justify-between w-full p-4'>
      <Logo />
      <Container className='flex flex-row align-middle gap-4'>
        <Text className='m-auto text-xl'>Bus</Text>
        <Text className='m-auto text-xl'>Routes</Text>
        {/* {notificationIcon('text-dark','text-3xl',{marginTop:'5px'})} */}
        <Text className='m-auto text-xl'>Profile</Text>
      </Container>
    </Container>
  )
};