import Image from 'next/image';
import Link from 'next/link';
import { OrganizationSwitcher, UserButton } from '@clerk/clerk-react';

import { SearchInput } from './search-input';

export const Navbar = () => {
  return (
    <nav className='flex items-center justify-between size-full'>
      <div className='flex gap-3 items-center shrink-0 pr-6'>
        <Link href='/'>
          <Image
            src='/logo.svg'
            alt='Logo'
            width={36}
            height={36}
          />
        </Link>
        <h3 className='text-xl'>Docs</h3>
      </div>
      <SearchInput />
      <div className='flex gap-3 items-center pl-6'>
        <OrganizationSwitcher
          afterCreateOrganizationUrl='/'
          afterLeaveOrganizationUrl='/'
          afterSelectOrganizationUrl='/'
          afterSelectPersonalUrl='/'
        />
        <UserButton />
      </div>
    </nav>
  );
};
