import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { AdminContext } from '../context/AdminContext';
import axios from 'axios'
import { toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom'
import { AppContext } from '../context/AppContext';


const Login = () => {
  const [state, setState] = useState('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {setAToken,backendUrl}=useContext(AppContext)
  const navigate=useNavigate()

  const onSubmitHandler=async(event)=>{
    event.preventDefault()

    try {
      if(state==='admin'){

        const {data}=await axios.post(backendUrl + '/api/admin/login',{email,password});
        if(data.success){
          console.log("Login success:", data.token);
          localStorage.setItem('atoken', data.token);
          setAToken(data.token)
          navigate('/admin-dashboard')
        }else{
          toast.error(data.message)
        }

      }else{

      }
    } catch (error) {
      
    }
  }

  return (
    <form onSubmit={onSubmitHandler} action="" className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className="text-2xl font-semibold m-auto">
          {state.charAt(0).toUpperCase() + state.slice(1)}{' '}
          <span className="text-primary">Login</span>
        </p>
        <div className="w-full">
          <p>Email</p>
          <input
          onChange={(e)=>setEmail(e.target.value)} value={email}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="email"
            required
          />
        </div>
        <div className="w-full">
          <p>Password</p>
          <input
          onChange={(e)=>setPassword(e.target.value)} value={password}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="password"
            required
          />
        </div>
        <button className="bg-primary text-white w-full py-2 rounded-md text-base">
          Login
        </button>
        {state === 'admin' ? (
          <p>
            Doctor Login?{' '}
            <span
              onClick={() => setState('doctor')}
              className="text-blue-500 cursor-pointer"
            >
              click here
            </span>
          </p>
        ) : (
          <p>
            Admin Login?{' '}
            <span
              onClick={() => setState('admin')}
              className="text-blue-500 cursor-pointer"
            >
              click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
