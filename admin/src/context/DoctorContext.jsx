import { createContext } from "react";
import { useState } from "react";
import axios from 'axios'
import {toast} from 'react-toastify'

export const DoctorContext=createContext()

const DoctorContextProvider=(props)=>{

     const backendUrl= import.meta.env.VITE_BACKEND_URL || "https://doctors-appointment-backend-wu75.onrender.com";

    const [dtoken,setDToken]=useState(localStorage.getItem('dtoken') || null)
    const [appointments,setAppointments]=useState([])
    const [dashData,setDashData]=useState(false)
    const [profileData,setProfileData]=useState(false)

    const getappointments=async()=>{
        try {
            const {data}=await axios.get(backendUrl+'/api/doctor/appointments',{headers:{dtoken}})

            if(data.success){
                setAppointments(data.appointments)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const completeappointment=async(appointmentId)=>{
        try {
            const {data}=await axios.post(backendUrl+'/api/doctor/complete-appointment',{appointmentId},{headers:{dtoken}})
            if(data.success){
                toast.success(data.message)
                getappointments()
            }else{
                toast.error(data.message)
            }
        } catch (error) {
             toast.error(error.message)
        }
    }
    const cancelappointment=async(appointmentId)=>{
        try {
            const {data}=await axios.post(backendUrl+'/api/doctor/cancel-appointment',{appointmentId},{headers:{dtoken}})
            if(data.success){
                toast.success(data.message)
                getappointments()
            }else{
                toast.error(data.message)
            }
        } catch (error) {
             toast.error(error.message)
        }
    }

    const getdashData=async(req,res)=>{
        try {
            const {data}=await axios.get(backendUrl+'/api/doctor/dashboard',{headers:{dtoken}})
            if(data.success){
                setDashData(data.dashData)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getprofiledata=async(req,res)=>{
        try {
            const {data}=await axios.get(backendUrl+'/api/doctor/doctor-profile',{headers:{dtoken}})

            if(data.success){
                setProfileData(data.profiledata)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    const value={
        dtoken,setDToken,backendUrl,
        appointments,setAppointments,getappointments,completeappointment,cancelappointment,
        dashData,setDashData,getdashData,
        profileData,setProfileData,getprofiledata
    }

    return(
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider
