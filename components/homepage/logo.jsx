import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Logo = () => {
  return (
    <div>
        <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="the squirrel" className='w-12' width={62} height={14} />
            <p href="#hero" className="text-2xl font-bold text-[#e05a00]">
              SquirrelPilot
            </p>
        </Link>
    </div>
  )
}

export default Logo