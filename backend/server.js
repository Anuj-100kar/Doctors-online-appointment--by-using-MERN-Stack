
import express from 'express'

import cors from 'cors'
import dotenv from 'dotenv'; 
dotenv.config();
import connectDB from './config/mongodb.js'
import connectcloudinary from './config/cloudinary.js'


const app=express()

const port =process.env.PORT || 4000


console.log('--- Server Start Environment Check ---');
console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID ? 'Loaded' : 'UNDEFINED');
console.log('RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? 'Loaded' : 'UNDEFINED');
console.log('CURRENCY:', process.env.CURRENCY ? 'Loaded' : 'UNDEFINED');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Loaded' : 'UNDEFINED');
console.log('--- End Server Start Environment Check ---');

app.use(express.json())
app.use(cors())
connectDB()
connectcloudinary()
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'

//end points
app.use('/api/admin',adminRouter)
app.use('/api/doctor',doctorRouter)
app.use('/api/user',userRouter)

app.get('/',(req,res)=>{
    res.send('api working ')
})

app.listen(port,()=>console.log('server started',port))