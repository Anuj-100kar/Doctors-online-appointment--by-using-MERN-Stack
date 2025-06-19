import doctorModel from "../models/doctorModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/AppointmentModel.js"

const changeAvailability=async(req,res)=>{
    try {

        const {docId}=req.docId

        const docData=await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId,{available:!docData.available})
        res.json({success:true,message:'Availability changed'})


    } catch (error) {

        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const doctorList=async(req,res)=>{
    try {
        const doctors=await doctorModel.find({}).select(['-password','-email'])

        res.json({success:true,doctors})

    } catch (error) {

        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//api for doctor login
const logindoctor=async(req,res)=>{
    try {
        const {email,password}=req.body
        const doctor=await doctorModel.findOne({email})

        if(!doctor){
            return res.json({success:false,message:'invalid credentials'})
        }

        const isMatch=await bcrypt.compare(password,doctor.password)

        if(isMatch){
            const token=jwt.sign({id:doctor._id},process.env.JWT_SECRET)
            res.json({success:true,token})
        }else{
            res.json({success:false,message:'invalid credentials'})
        }
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//api to doctor appointmnet

const appointmentsdoctor=async(req,res)=>{
    try {
        const docId=req.docId

        const appointments=await appointmentModel.find({docId})

        res.json({success:true,appointments})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//api to mark complete appointment
const appointmentcomplete=async(req,res)=>{
    try {
        const {appointmentId}=req.body
        const docId=req.docId

        const appointmentdata=await appointmentModel.findById(appointmentId)

        if(appointmentdata && appointmentdata.docId===docId){
            await appointmentModel.findByIdAndUpdate(appointmentId,{isCompleted:true})
            return res.json({success:true,message:'appointment completed'})
        }else{
            return res.json({success:false,message:'mark failed'})
        }
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}
const appointmentcancel=async(req,res)=>{
    try {
        const {appointmentId}=req.body
        const docId=req.docId

        const appointmentdata=await appointmentModel.findById(appointmentId)

        if(appointmentdata && appointmentdata.docId===docId){
            await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})
            return res.json({success:true,message:'appointment cancelled'})
        }else{
            return res.json({success:false,message:'cancellation failed'})
        }
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//api to get dashboard
const doctorDashboard=async(req,res)=>{
    try {
        const docId=req.docId
        
        const appointments=await appointmentModel.find({docId})

        let earnings=0

        appointments.map((item)=>{
            if(item.isCompleted || item.payment){
                earnings+=item.amount
            }
        })

        let patients=[]
        appointments.map((item)=>{
            if(!patients.includes(item.userId)){
                patients.push(item.userId)
            }
        })

        const dashData={
            earnings,appointments:appointments.length
            ,patients:patients.length,
            latestappointments:appointments.reverse().slice(0,5)
        }

        res.json({success:true,dashData})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const doctorprofile=async(req,res)=>{
    try {
        const docId=req.docId

        const profiledata=await doctorModel.findById(docId).select('-password')

        res.json({success:true,profiledata})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const updatedoctorprofile=async(req,res)=>{
    try {
        const {fees,address,available}=req.body
        const docId=req.docId

        await doctorModel.findByIdAndUpdate(docId,{fees,address,available})

        res.json({success:true,message:'profile updated'})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}
export {changeAvailability,doctorList,logindoctor,appointmentsdoctor,appointmentcomplete,appointmentcancel,doctorDashboard,doctorprofile,updatedoctorprofile}