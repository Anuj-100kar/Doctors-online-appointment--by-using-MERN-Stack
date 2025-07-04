import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext';
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import {toast} from 'react-toastify'
import {useNavigate} from 'react-router-dom'

function MyAppointments() {
  

  const {backendUrl,token,getdoctorsdata} =useContext(AppContext);

  const [appointments,setAppointments]=useState([])
  const months=["","jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"]

  

  const slotDateFormat=(slotDate)=>{
    const dateArray=slotDate.split('_')
    return dateArray[0]+" "+months[Number(dateArray[1])]+" "+dateArray[2]
  }

  const navigate=useNavigate();
  const getuserappointments=async()=>{
   
    try {
       console.log("MyAppointments: Attempting to fetch user appointments. Token available:", !!token);
      const {data}=await axios.get(backendUrl+'/api/user/appointments',{headers:{token}})

      if(data.success){
        setAppointments(data.appointments.reverse())
        console.log("MyAppointments: Fetched appointments successfully. Raw data:", data.appointments);
        console.log(data.appointments)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const cancelappointment=async(appointmentId)=>{
    try {
      const {data}=await axios.post(backendUrl+'/api/user/cancel-appointment',{appointmentId},{headers:{token}})

      if(data.success){
        toast.success(data.message)
        getuserappointments()
        getdoctorsdata()
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  }
 const initpay = (order) => {
  
    if (typeof window.Razorpay === 'undefined') {
      toast.error('Razorpay SDK is not loaded.');
      return; 
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
      amount: order.amount, 
      currency: order.currency,
      name: 'pay online',
      description: 'Payment for Doctor Appointment',
      order_id: order.id, 
      receipt: order.receipt, 
      handler: async (response) => {
        console.log(response);
        try {
          const { data } = await axios.post(backendUrl + '/api/user/verify-razorpay',response , { headers: { token } });

          if (data.success) {
            toast.success(data.message);
            getuserappointments(); 
            navigate('/my-appointments')
            
          } else {
            toast.error(data.message);
          }
        } catch (error) {
          console.error( error);
          toast.error(error.message)
        }
      },
      
      
    };

    const rzp = new window.Razorpay(options);

    rzp.open();
  };


  const appointmentRazorpay=async(appointmentId)=>{
    try {
      const {data}=await axios.post(backendUrl+'/api/user/payment-razorpay',{appointmentId},{headers:{token}})

      if(data.success){
        initpay(data.order)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    if(token){
      getuserappointments()
    }
  },[token])

  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My appointments</p>
      <div>
        {
          appointments.map((item,index)=>(
            <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={item._id}>
              <div>
                <img className='w-32 bg-indigo-50' src={item.docData.image} alt="" />
              </div>
              <div className='flex-1 text-sm text-zinc-600 '>
                <p className='text-neutral-800 font-semibold '>{item.docData.name}</p>
                <p>{item.docData.speciality}</p>
                <p className='text-zinc-700 font-medium mt-1'>Address: </p>
                <p className='text-xs'>{item.docData.address.line1}</p>
                <p className='text-xs'>{item.docData.address.line2}</p>
                <p className='text-xs mt-1'><span className='text-sm text-neutral-700 font-medium'>Date & Time:</span>{slotDateFormat(item.slotDate)} | {item.slotTime}</p>
              </div>
              <div></div>
              <div className='flex flex-col gap-2 justify-end'>
             
                {!item.cancelled && !item.payment && !item.isCompleted && <button onClick={()=>appointmentRazorpay(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-500'>Pay Online</button>}
                 {!item.cancelled && item.payment && !item.isCompleted && <button className='sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-50'>Paid</button> }
                {!item.cancelled && !item.isCompleted && <button onClick={()=>cancelappointment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-500'>Cancel appointment</button>}
                {item.cancelled && !item.isCompleted && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>appointment cancelled</button> }
                {item.isCompleted && <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'>completed</button> }
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default MyAppointments
