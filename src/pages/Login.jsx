import React, { useState } from 'react'

function Login() {
  const [state,setState]=useState('Sign Up')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [name,setName]=useState('')

  const onSubmitHandler=(e)=>{
    e.preventDefault();
  }
  return (
    <form action="" className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col m-auto gap-3 items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-xl'>
        <p className='text-2xl font-semibold'>{state==='Sign Up'?'Create account':'Login'}</p>
        <p>Please {state==='Sign Up'?'sign up':'log in'} to book appointment</p>
        {
          state==='Sign Up'&& <div  className='w-full'>
          <p>Full Name</p>
          <input className='border border-zinc-300 w-full rounded mt-1 p-2' type="text" value={name} onChange={(e)=>setName(e.target.name)} required />
        </div>
        }
        
        <div className='w-full'>
          <p>Email</p>
          <input className='border border-zinc-300 w-full rounded mt-1 p-2' type="email" value={email} onChange={(e)=>setEmail(e.target.email)}  required/>
        </div>
        <div className='w-full'>
          <p>Password</p>
          <input className='border border-zinc-300 w-full rounded mt-1 p-2' type="password" value={password} onChange={(e)=>setPassword(e.target.password)} required/>
        </div>
        <button className='bg-primary text-white w-full rounded-md py-2 text-base '>{state==='Sign Up'?'Create account':'Login'}</button>
        {
          state==='Sign Up'?<p>Already have an account? <span  onClick={()=>setState('Login')} className='text-primary underline cursor-pointer'>Login here</span></p>:
          <p>Create an new account?<span onClick={()=>setState('Sign Up')} className='text-primary underline cursor-pointer'>Click here</span> </p>
        }
      </div>
    </form>
  )
}

export default Login
