import validator from 'validator'
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import jwt from 'jsonwebtoken'

 const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const imagefile = req.file;

        if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address){
            return res.json({success:false,message:"missing details"})
        }

        if(!validator.isEmail(email)){
            return res.json({success:false,message:"please enter a valid email"})
        }

        if(password.length<8){
            return res.json({success:false,message:"please enter a strong password"})
        }

        const salt=await bcrypt.genSalt(10)
        const hashpassword=await bcrypt.hash(password,salt)

        //upload image to cloudinary
        const imageupload=await cloudinary.uploader.upload(imagefile.path,{resource_type:"image"})
        const imageUrl=imageupload.secure_url

        const doctordata={
            name,
            email,
            image:imageUrl,
            password:hashpassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:JSON.parse(address),
            date:Date.now()
        }

        const newDoctor= new doctorModel(doctordata)
        await newDoctor.save()

        res.json({success:true,message:"doctor added"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
};

const loginAdmin=async(req,res)=>{
    try {
        const {email,password}=req.body

        if(email===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD){

            const token = jwt.sign({ email:email,role:'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' })

            res.json({success:true,token})
        }else{
            res.json({success:false,message:'invalid credentials'})
        }
    } catch (error) {
         console.log(error)
        res.json({success:false,message:error.message})
    }
}

//api to get all doctors list

const allDoctors=async(req,res)=>{
    try {
        const doctors=await doctorModel.find({}).select(['-password','-email'])
         if (!doctors || doctors.length === 0) {
            return res.status(404).json({ success: false, message: "No doctors found." });
        }
        res.json({success:true,doctors})
    } catch (error) {
        console.error(error)
        res.json({success:false,message:error.message})
    }
}
export {addDoctor,loginAdmin,allDoctors}