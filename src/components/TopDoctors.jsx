import React, { useContext } from 'react'
import {useNavigate} from 'react-router-dom'
import { AppContext } from '../context/AppContext';

const TopDoctors = () => {
  const navigate=useNavigate();
  const {doctors}=useContext(AppContext)
  return (
    <div className='flex flex-col  items-center gap-3 my-16 text-gray-900 md:mx-10'>
      <h1 className='md:text-3xl  font-semibold'>Top Doctors to Book</h1>
      <p className='text-sm  font-semibold'>Simply browse through our extensive list of trusted doctors.</p>
      <div className='w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
        {doctors.slice(0,10).map((item,index)=>(
                <div onClick={()=>{navigate(`/appointment/${item._id}`);scrollTo(0,0)}} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'>
                    <img className='bg-blue-50' src={item.image} alt="" />
                    <div className='p-4'>
                        <div className='flex items-center gap-2 text-green-400 text-sm'>
                           <p className='w-2 h-2 bg-green-500 rounded-full'></p> <p>Available</p>
                        </div>
                        <p  className='text-gray-900 text-lg font-medium'>{item.name}</p>
                        <p className='text-gray-500 text-sm' >{item.speciality}</p>
                    </div>
                </div>
                
            ))
        }
      </div>
      <button onClick={()=>{navigate('/doctors'); scrollTo(0,0)}} className='bg-blue-50 text-gray-500 px-12 py-3 rounded-full mt-10'>more</button>
    </div>
  )
}

export default TopDoctors
