import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

function Navbar() {
    const navigate = useNavigate();
    const {token,setToken,userData}=useContext(AppContext)
    const [showmenu, setShowMenu] = useState(false);

    const logout=()=>{
        setToken('')
        localStorage.removeItem('token')
    }
    

    return (
        <div className='flex items-center justify-between text-sm mb-5 py-4 border-b border-b-gray-600'>

            
            <img onClick={() => navigate('/')} className='w-44 cursor-pointer' src={assets.logo} alt="logo" />

            {/* Desktop Menu */}
            <ul className='hidden md:flex items-start gap-5 font-medium'>
                <NavLink to="/">
                    <li className='py-1'>HOME</li>
                </NavLink>
                <NavLink to="/doctors">
                    <li className='py-1'>ALL DOCTORS</li>
                </NavLink>
                <NavLink to="/about">
                    <li className='py-1'>ABOUT</li>
                </NavLink>
                <NavLink to="/contact">
                    <li className='py-1'>CONTACT</li>
                </NavLink>
            </ul>

            {/* Right-side controls */}
            <div className='flex items-center gap-4'>

               
                {token && userData ? (
                    <div className='relative group flex items-center gap-2 cursor-pointer'>
                        <img className='w-8 rounded-full' src={userData.image} alt="profile" />
                        <img className='w-2.5' src={assets.dropdown_icon} alt="dropdown" />

                       
                        <div className='absolute top-full right-0 mt-2 font-medium text-gray-500 hidden group-hover:block z-30'>
                            <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-2 shadow-md'>
                                <p onClick={() => navigate('/my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                                <p onClick={() => navigate('/my-appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>
                                <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => navigate('/login')}
                        className='bg-primary px-8 py-3 rounded-full text-white font-light hidden md:block'
                    >
                        Create Account
                    </button>
                )}

                {/* Mobile Menu Icon */}
                <img
                    onClick={() => setShowMenu(true)}
                    className='w-5 md:hidden cursor-pointer'
                    src={assets.menu_icon}
                    alt="menu"
                />
            </div>

            
            <div className={`fixed top-0 right-0 z-20 bg-white overflow-hidden transition-all duration-300 ease-in-out md:hidden ${showmenu ? 'w-full h-full' : 'w-0 h-0'}`}>
                <div className='flex items-center justify-between px-5 py-6'>
                    <img className='w-36' src={assets.logo} alt="logo" />
                    <img
                        className='w-7 cursor-pointer'
                        onClick={() => setShowMenu(false)}
                        src={assets.cross_icon}
                        alt="close"
                    />
                </div>

                
                <ul className='flex flex-col items-center mt-5 gap-4 px-5 text-lg font-medium'>
                    <NavLink  onClick={() => setShowMenu(false)} to='/'><p className='px-4 py-2 rounded-full inline-block '>Home</p></NavLink>
                    <NavLink  onClick={() => setShowMenu(false)} to='/doctors'><p className='px-4 py-2 rounded-full inline-block '>All Doctors</p></NavLink>
                    <NavLink  onClick={() => setShowMenu(false)} to='/about'><p className='px-4 py-2 rounded-full inline-block '>About</p></NavLink>
                    <NavLink  onClick={() => setShowMenu(false)} to='/contact'><p className='px-4 py-2 rounded-full inline-block '>Contact</p></NavLink>
                </ul>
            </div>
        </div>
    );
}

export default Navbar;
