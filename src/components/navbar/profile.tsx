import React from 'react'
import Image from 'next/image'

const Profile = () => {
  return (
    <div className='flex items-center gap-4 border-l-2 border-[#D0D6DE] pl-4'>
        <p className=' text-sm'>Hello,  <span className='font-semibold'>Adarsh</span></p>
        <Image src='https://images.unsplash.com/photo-1503235930437-8c6293ba41f5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' className='rounded-full object-cover aspect-square border-4 border-white cursor-pointer' width={40} height={40}  alt='profile'/>
    </div>
  )
}

export default Profile