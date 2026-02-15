import { createContext, useEffect, useState } from "react"
import axios from 'axios'
import {toast} from 'react-toastify'

export const AppContext=createContext();

const AppContextProvider=(props)=>{

    const currencySymbol='$';
    const backendUrl=import.meta.env.VITE_BACKEND_URL|| "https://doctors-appointment-backend-wu75.onrender.com"
    const [doctors,setDoctors]=useState([])
    const [token,setToken]=useState(localStorage.getItem('token')?localStorage.getItem('token'):false)
    const [userData,setUserData]=useState(false)


    const getdoctorsdata=async()=>{
        try {
            const {data}=await axios.get(backendUrl + '/api/doctor/list')
            if(data.success){
                setDoctors(data.doctors)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const loaduserprofiledata=async(req,res)=>{
        try {
            const {data}=await axios.get(backendUrl+ '/api/user/get-profile',{headers:{Authorization:`Bearer ${token}`}})
            if(data.success){
                setUserData(data.userData)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const value={
        doctors,
        currencySymbol,token,setToken,backendUrl,
        userData,setUserData,
        loaduserprofiledata,
        getdoctorsdata
    }

    useEffect(()=>{
        getdoctorsdata()
    },[])

    useEffect(()=>{
        if(token){
            console.log(token)
            loaduserprofiledata()
        }else{
            setUserData(false)
        }
    },[token])
    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider
