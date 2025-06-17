import { createContext ,useState, useEffect } from "react";
import axios from 'axios';
import {toast} from 'react-toastify';

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
    const [atoken, setAToken] = useState(localStorage.getItem('atoken') || null);
    const [doctors, setDoctors] = useState([]);
    

    
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"; 
   

    const getalldoctors = async () => {
        try {
            console.log("Attempting to fetch doctors from URL:", backendUrl + '/api/admin/all-doctors'); 
           
            const { data } = await axios.get(backendUrl + '/api/admin/all-doctors', { 
                headers: { atoken: atoken } 
            });
            
            console.log("Response from /all-doctors:", data); 

            if (data.success) {
                setDoctors(data.doctors);
                console.log("Fetched doctors successfully:", data.doctors);
            } else {
                toast.error(data.message);
                console.error("Failed to fetch doctors with message:", data.message);
            }
        } catch (error) {
            console.error("Error fetching doctors:", error); 
            toast.error("Error fetching doctors: " + error.message);
        }
    };


    const changeAvailability = async (docId) => { 
        try {
        
            const { data } = await axios.post(backendUrl + '/api/admin/change-availability', { docId }, { headers: { atoken: atoken } });
            if (data.success) {
                toast.success(data.message);
                getalldoctors(); 
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error changing availability:", error); 
            toast.error("Error changing availability: " + error.message);
        }
    };

    useEffect(() => {
        if (atoken) {
            localStorage.setItem('atoken', atoken);
        } else {
            localStorage.removeItem('atoken');
        }
    }, [atoken]);

    const value = {
        atoken,
        setAToken,
        backendUrl,
        doctors,
        getalldoctors,
        changeAvailability
    };

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;
