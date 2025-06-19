import express from 'express'

import { registeruser ,loginuser, getprofile,updateuserprofile,bookappointment,listappointment,cancelappointment,paymentRazorpay,verifyrazorpay} from '../controllers/usercontroller.js'
import authuser from '../middleware/authuser.js'
import upload from '../middleware/multer.js'

const userRouter=express.Router()

userRouter.post('/register',registeruser)
userRouter.post('/login',loginuser)
userRouter.get('/get-profile',authuser,getprofile)
userRouter.post('/update-profile',upload.single('image'),authuser,updateuserprofile)
userRouter.post('/book-appointment',authuser,bookappointment)
userRouter.get('/appointments',authuser,listappointment)
userRouter.post('/cancel-appointment',authuser,cancelappointment)
userRouter.post('/payment-razorpay',authuser,paymentRazorpay)
userRouter.post('/verify-razorpay',authuser,verifyrazorpay)








export default userRouter