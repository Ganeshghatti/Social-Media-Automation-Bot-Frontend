import React from 'react'
import InputSearch from './input-search'
import Profile from './profile'

const Navbar = () => {
  return (
    <nav className='w-full bg-customPrimary px-4 py-4 flex items-center justify-between border-b'>
        <InputSearch />
        <Profile />
    </nav>
  )
}

export default Navbar