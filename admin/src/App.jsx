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
import { DoctorContext } from './context/DoctorContext';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorProfile from './pages/Doctor/DoctorProfile';

const App = () => {

  const {atoken}=useContext(AdminContext)
  const { dtoken } = useContext(DoctorContext);

  return atoken || dtoken ? 
    
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

               <Route path='/doctor-dashboard' element={<DoctorDashboard/>} />
              <Route path='/doctor-appointments' element={<DoctorAppointments/>} />
              <Route path='/doctor-profile' element={<DoctorProfile/>} />

              


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
