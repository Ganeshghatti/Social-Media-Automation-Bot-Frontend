import React from 'react'
import InstagramTable from '@/components/instagram/instagram-table'

const page = () => {
  return (
    <main className="p-8">
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Upload Instagram Post by Automation
        </h1>
      </div>
    </div>
    <div className="mt-10">
      <InstagramTable />
    </div>
  </main>
  )
}

export default page