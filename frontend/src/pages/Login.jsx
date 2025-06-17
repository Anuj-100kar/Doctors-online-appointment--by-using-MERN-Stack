import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import {toast} from 'react-toastify'
import {useNavigate} from 'react-router-dom'


function Login() {

  const {backendUrl ,token,setToken}=useContext(AppContext);

  const navigate=useNavigate()
  const [state,setState]=useState('Sign Up')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [name,setName]=useState('')

  const onSubmitHandler=async(e)=>{
    e.preventDefault();

    try {
      if(state==='Sign Up'){
        const {data}= await axios.post(backendUrl+ '/api/user/register',{name,password,email})
        if(data.success){
          localStorage.setItem('token',data.token)
          setToken(data.token)

        }else{
          toast.error(data.message)
        }
      }else{
        const {data}= await axios.post(backendUrl+ '/api/user/login',{password,email})
        if(data.success){
          localStorage.setItem('token',data.token)
          setToken(data.token)

        }else{
          toast.error(data.message)
        }
      }
      
    } catch (error) {
      toast.error(error.message)

    }
  }
useEffect(()=>{
      if(token){
        navigate('/')
      }
    },[token])
  

  return (
    <form onSubmit={onSubmitHandler} action="" className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col m-auto gap-3 items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-xl'>
        <p className='text-2xl font-semibold'>{state==='Sign Up'?'Create account':'Login'}</p>
        <p>Please {state==='Sign Up'?'sign up':'log in'} to book appointment</p>
        {
          state==='Sign Up'&& <div  className='w-full'>
          <p>Full Name</p>
          <input  className='border border-zinc-300 w-full rounded mt-1 p-2' type="text" value={name} onChange={(e)=>setName(e.target.value)} required />
        </div>
        }
        
        <div className='w-full'>
          <p>Email</p>
          <input className='border border-zinc-300 w-full rounded mt-1 p-2' type="email" value={email} onChange={(e)=>setEmail(e.target.value)}  required/>
        </div>
        <div className='w-full'>
          <p>Password</p>
          <input className='border border-zinc-300 w-full rounded mt-1 p-2' type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
        </div>
        <button type='submit'  className='bg-primary text-white w-full rounded-md py-2 text-base '>{state==='Sign Up'?'Create account':'Login'}</button>
        {
          state==='Sign Up'?<p>Already have an account? <span  onClick={()=>setState('Login')} className='text-primary underline cursor-pointer'>Login here</span></p>:
          <p>Create an new account?<span onClick={()=>setState('Sign Up')} className='text-primary underline cursor-pointer'>Click here</span> </p>
        }
      </div>
    </form>
  )
}

export default Login
