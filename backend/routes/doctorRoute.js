import express from 'express'
import { doctorList } from '../controllers/doctorcontroller.js'

const doctorRouter=express.Router()

doctorRouter.get('/list',doctorList)
doctorRouter.post('/list',doctorList)

export default doctorRouter