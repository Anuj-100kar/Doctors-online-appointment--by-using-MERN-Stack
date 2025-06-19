import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom';

const RelatedDoctors = ({speciality,docId}) => {

    const {doctors} =useContext(AppContext);

    const navigate=useNavigate()
    const [reldoc ,setRelDoc]=useState([])
    useEffect(()=>{
    if(doctors.length>0 && speciality){
        const doctorsdata=doctors.filter((doc)=>doc.speciality===speciality && doc._id!==docId)
        setRelDoc(doctorsdata);

    }},[doctors,docId,speciality])
  return (
    <div className='flex flex-col  items-center gap-3 my-16 text-gray-900 md:mx-10'>
      <h1 className='md:text-3xl  font-semibold'>Related Doctors</h1>
      <p className='text-sm  font-light text-gray-800'>Simply browse through our extensive list of trusted doctors.

</p>
      <div className='w-full grid grid-cols-5 gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
        {reldoc.slice(0,5).map((item,index)=>(
                <div key={item._id} onClick={()=>{navigate(`/appointment/${item._id}`);scrollTo(0,0)}} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'>
                    <img className='bg-blue-50' src={item.image} alt="" />
                    <div className='p-4'>
                        <div className={`flex items-center gap-2 ${item.available ? 'text-green-400':'text-gray-500'}  text-sm`}>
                           <p className={`w-2 h-2 ${item.available ? 'bg-green-500':'bg-gray-500'}  rounded-full`}></p> <p>{item.available ? 'available':'not available'}</p>
                        </div>
                        <p  className='text-gray-900 text-lg font-medium'>{item.name}</p>
                        <p className='text-gray-500 text-sm' >{item.speciality}</p>
                    </div>
                </div>
                
            ))
        }
      </div>
      
    </div>
  )
}

export default RelatedDoctors
