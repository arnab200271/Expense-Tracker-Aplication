import Profileupdate from '@/profileupdate/Profileupdate'
import React from 'react'
import Header from "../../../Layout/header/Header"
const settings = () => {
  return (
    <div className='bg-gray-900 text-white min-h-screen m-0 '>
        <Header/>
        <Profileupdate/>
    </div>
  )
}

export default settings