import express from 'express'
import { doctorList,logindoctor,appointmentsdoctor ,appointmentcancel,appointmentcomplete,doctorDashboard,updatedoctorprofile,doctorprofile} from '../controllers/doctorcontroller.js'
import authDoctor from '../middleware/authDoctor.js'

const doctorRouter=express.Router()

doctorRouter.get('/list',doctorList)
doctorRouter.post('/login',logindoctor)
doctorRouter.get('/appointments',authDoctor,appointmentsdoctor)
doctorRouter.post('/cancel-appointment',authDoctor,appointmentcancel)
doctorRouter.post('/complete-appointment',authDoctor,appointmentcomplete)
doctorRouter.get('/dashboard',authDoctor,doctorDashboard)
doctorRouter.get('/doctor-profile',authDoctor,doctorprofile)
doctorRouter.post('/update-doctorprofile',authDoctor,updatedoctorprofile)

export default doctorRouter