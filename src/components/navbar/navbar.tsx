import React from 'react'
import Profile from './profile'

const Navbar = () => {
  return (
    <nav className='w-full bg-lightPrimary dark:bg-darkPrimary px-4 py-4 flex items-center justify-end'>
        <Profile />
    </nav>
  )
}

export default Navbar