import React from 'react'
import Profile from './profile'
import ThemeChange from '../global/theme-change'

const Navbar = () => {
  return (
    <nav className='w-full bg-lightPrimary dark:bg-darkPrimary gap-10 px-4 py-4 flex items-center justify-end'>
        <Profile />
        <ThemeChange />
    </nav>
  )
}

export default Navbar