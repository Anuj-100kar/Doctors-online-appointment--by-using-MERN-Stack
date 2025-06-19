import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const Allappointments = () => {
  const {atoken,getallappointments,appointments,cancelappointment}=useContext(AdminContext)
  const {calculateage,slotDateFormat,currency}=useContext(AppContext)

  useEffect(()=>{
    if(atoken){
      getallappointments()
    }
  },[atoken])
  console.log("Appointments data:", appointments);
  console.log("Number of appointments:", appointments.length);
  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>
      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b'>
          <p>#</p>
          <p>patient</p>
          <p>age</p>
          <p>date & time</p>
          <p>doctor</p>
          <p>fees</p>
          <p>actions</p>
        </div>
        {
          appointments.map((item,index)=>(
            <div className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
              <p className='max-sm:hidden '>{index+1}</p>
              <div className='flex items-center gap-2 '>
                <img className='w-8 rounded-full ' src={item.userData.image} alt="" /><p>{item.userData.name}</p>
              </div>
              <p className='max-sm:hidden'>{calculateage(item.userData.dob)}</p>
              <p>{slotDateFormat(item.slotDate)},{item.soltTime}</p>
              <div className='flex items-center gap-2 '>
                <img className='w-8 rounded-full bg-gray-200' src={item.docData.image} alt="" /><p>{item.docData.name}</p>
              </div>
              <p>{currency}{item.amount}</p>
              {
                item.cancelled
                ?<p className='text-red-400 text-xs font-medium'>Cancelled</p>:
                item.isCompleted
                ? <p className='text-green-500 text-xs font-medium'>completed</p> :
                 <img onClick={()=>cancelappointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
              }
             
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Allappointments
