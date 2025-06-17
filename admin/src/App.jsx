import React, { useContext } from 'react';
import Login from './pages/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Routes ,Route } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import Allappointments from './pages/Admin/Allappointments';
import AddDoctor from './pages/Admin/AddDoctor';
import AllDoctorsList from './pages/Admin/AllDoctorsList';

const App = () => {
  const { atoken } = useContext(AdminContext);

  return atoken ? 
    
       (
        <>
          <ToastContainer />
          <Navbar />
          <div className='flex items-start '>
            <Sidebar/>
            <Routes>
              <Route path='/' element={<Dashboard/>}/>
              <Route path='/admin-dashboard' element={<Dashboard/>} />
              <Route path='/all-appointments' element={<Allappointments/>} />
              <Route path='/add-doctor' element={<AddDoctor/>}/>
              <Route path='/all-doctors' element={<AllDoctorsList/>}/>

            </Routes>
          </div>
          
        </>
      ) : (
        <>
          <Login />
          <ToastContainer />
        </>
      )
};

export default App;
