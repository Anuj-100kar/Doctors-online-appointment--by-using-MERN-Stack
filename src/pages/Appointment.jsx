import React, { useContext, useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';

function Appointment() {

   const navigate=useNavigate();
  const {docId} =useParams();
  const {doctors ,currencySymbol} =useContext(AppContext);
  const daysofweek=['MON','TUE','WED','THU','FRI','SAT','SUN'];

  const [docInfo,setDocInfo]=useState(null);

  const [docSlots,setDocSlots]=useState([])
  const [slotIndex,setSlotIndex]=useState(0)
  const [slotTime,setSlotTime]=useState('')

  const fetchDocInfo=async()=>{
    const docInfo=doctors.find(doc=>doc._id===docId)
    setDocInfo(docInfo);
  }

  const getAvailableSlots=async()=>{
    setDocSlots([])

    let today=new Date();
    for(let i=0;i<7;i++){
      let currentdate=new Date(today);
      currentdate.setDate(today.getDate()+i);

      let endtime=new Date();
      endtime.setDate(today.getDate()+i)
      endtime.setHours(21,0,0,0)

      if(today.getDate()===currentdate.getDate()){
        currentdate.setHours(currentdate.getHours()>10? currentdate.getHours()+1:10)
        currentdate.setMinutes(currentdate.getMinutes()>30? 30:0)
      }else{
        currentdate.setHours(10)
        currentdate.setMinutes(0)
      }

      let timeslots=[]
      while(currentdate<endtime){
        let formattedTime=currentdate.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})

        timeslots.push({
          datetime:new Date(currentdate),
          time:formattedTime
        })

        currentdate.setMinutes(currentdate.getMinutes()+30)
      }

      setDocSlots(prev=>([...prev,timeslots]))
    }
  }

  useEffect(()=>{
    fetchDocInfo();
  },[doctors,docId])

  useEffect(()=>{
    getAvailableSlots();
  },[docInfo])

  useEffect(()=>{

  },[docSlots])

  return docInfo &&(
    <div>
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
        </div>
        <div className='flex-1 border border-gray-400 rounded-lg px-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>{docInfo.name}
          <img className='w-5' src={assets.verified_icon} alt="" />
          </p>
          <div className='flex items-center text-sm mt-1 text-gray-600'>
            <p>
              {docInfo.degree} - 
              {docInfo.speciality}
            </p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
          </div>
          <div>
             <p className='flex items-center gap-1 mt-3 text-gray-900 text-sm font-medium'>
                About <img src={assets.info_icon} alt="" />
            </p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>
          <p className='text-gray-500 font-medium mt-4'>
            Appointment fee <span className='text-gray-600'>{currencySymbol}{docInfo.fees}</span>
          </p>
        </div>
      </div>
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
          <p>Booking slots</p>
          <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
            {
              docSlots.length>0 && docSlots.map((item,index)=>(
                <div onClick={()=>setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex===index ? 'bg-primary text-white':'border border-gray-200'}`} key={index}>
                  <p>{item[0] && daysofweek[item[0].datetime.getDay()]}</p>
                  <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))
            }
          </div>
          <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4 '>
            {
              docSlots.length>0 && docSlots[slotIndex].map((item,index)=>(
                  <p onClick={()=>setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time===slotTime?"bg-primary text-white":"border border-gray-400"}`} key={index}>
                    {item.time.toLowerCase()}
                  </p>
              ))
            }
          </div>
          <button onClick={()=>navigate('/login')} className='px-14 py-3 bg-primary rounded-full text-white flex items-center text-sm font-light mt-6'>Book an Appointment</button>
      </div>
      <RelatedDoctors docId={docId} speciality={docInfo.speciality}/>
    </div>
  )
}

export default Appointment
