import razorpay from 'razorpay'
import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/AppointmentModel.js'




console.log(process.env)

console.log(process.env)
const registeruser=async(req,res)=>{
    try {
        
        const {name,email,password}=req.body

        if(!name || !email || !password){
            return res.json({success:false,message:'missing details'})
        }

        if(!validator.isEmail(email)){
            return res.json({success:false,message:'enter a valid email'})
        }

        if(password.length<8){
            return res.json({success:false,message:'enter a long password'})
        }

        const exists = await userModel.findOne({ email });if 
        (exists) {
            return res.json({ success: false, message: 'User with this email already exists' });
        }

        //hasing user password
        const salt=await bcrypt.genSalt(10)
        const hashpassword=await bcrypt.hash(password,salt)

        const userdata={
            name,
            email,
            password:hashpassword
        }

        const newuser=new userModel(userdata)
        const user=await newuser.save()

        const token=jwt.sign({id:user._id},process.env.JWT_SECRET)

        res.json({success:true,token})

    } catch (error) {
        console.error(error)
        res.json({success:false,message:error.message})
    }
}

//api for user login 
const loginuser=async(req,res)=>{
    try {
        
        const {email,password} =req.body
        const user=await userModel.findOne({email})

        if(!user){
            return res.json({success:false,message:'user does not exist'})
        }

        const isMatch=await bcrypt.compare(password,user.password)
        if(isMatch){
            const token=jwt.sign({id:user._id},process.env.JWT_SECRET)
            res.json({success:true,token})
        }else{
            res.json({success:false,message:'invalid credentials'})
        }
    } catch (error) {
        console.error(error)
        res.json({success:false,message:error.message})
    }
}

const getprofile=async(req,res)=>{
    try {
        const userId=req.userId
        const userData=await userModel.findById(userId).select('-password')

        if(!userData){
            return res.json({success:false,message:'user profile not found'})
        }

        res.json({success:true,userData})
        
    } catch (error) {
        console.error(error)
        res.json({success:false,message:error.message})
    }
}

const updateuserprofile = async (req, res) => {
    try {
        const userId = req.userId;
       
        const { name, phone, address, dob, gender } = req.body;
        const imageFile = req.file; 

        
        console.log('--- Inside updateuserprofile ---');
        console.log('Received userId:', userId);
        console.log('Received text data:', { name, phone, address, dob, gender });
        console.log('Received imageFile object from Multer:', imageFile);
        

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: 'Required profile data missing.' });
        }

        
        const updateData = {
            name,
            phone,
            
            address: JSON.parse(address), 
            dob,
            gender
        };

        
        await userModel.findByIdAndUpdate(userId, updateData, { new: true }); 

        
        if (imageFile) {
            
            
            console.log( imageFile.path); 
            

            try {
                
                const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
                const imageURL = imageUpload.secure_url;

                
                console.log('Cloudinary upload successful. Image URL:', imageURL);
            
                await userModel.findByIdAndUpdate(userId, { image: imageURL }, { new: true });
            } catch (cloudinaryError) {
                
                console.error('Cloudinary upload failed:', cloudinaryError);
                return res.json({ success: false, message: 'Image upload failed. Please try again.' });
            }
        }

        res.json({ success: true, message: 'Profile updated successfully!' });

    } catch (error) {
        
        console.error( error);
        res.json({ success: false, message: error.message });
    }
};

//api to book appointment
const bookappointment=async(req,res)=>{
    try {
        const {userId,docId,slotDate,slotTime}=req.body

        const docData=await doctorModel.findById(docId).select('-password')

        if(!docData.available){
            return res.json({success:false,message:'doctor not available'})
        }

        let slots_booked=docData.slots_booked

        if(slots_booked[slotDate]){
            if(slots_booked[slotDate].includes(slotTime)){
                return res.json({success:false,message:'slot not available'})
            }else{
                slots_booked[slotDate].push(slotTime)
            }
        }else{
            slots_booked[slotDate]=[]
            slots_booked[slotDate].push(slotTime)
        }

        const userData=await userModel.findById(userId).select('-password')

        delete docData.slots_booked

        const appointmentData={
            userId,
            docId,
            userData,
            docData,
            amount:docData.fees,
            slotTime,
            slotDate,
            date:Date.now(),
            isCompleted:false,
            payment:false,
            cancelled:false,

        }

        const newAppointment=new appointmentModel(appointmentData)
        await newAppointment.save()

        //save slots for doctors data
        await doctorModel.findByIdAndUpdate(docId,{slots_booked})

        res.json({success:true,message:'appointment booked'})

    } catch (error) {
        console.error( error);
        res.json({ success: false, message: error.message });
    }
}



const listappointment=async(req,res)=>{
    try {
        const userId=req.userId // <-- ISSUE HERE!
        const appointments=await appointmentModel.find({userId})

        res.json({success:true,appointments})
    } catch (error) {
        console.error( error);
        res.json({ success: false, message: error.message });
    }
}

const cancelappointment=async(req,res)=>{
    try {
        
        const userId=req.userId
        const {appointmentId}=req.body

        const appointmentdata=await appointmentModel.findById(appointmentId)

        if(appointmentdata.userId!==userId){
            return res.json({success:false,message:'unauthorized action'})
        }

        await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})

        //releasing doctor slot 
        const {docId,slotDate,slotTime}=appointmentdata

        const doctordata=await doctorModel.findById(docId)

        let slots_booked=doctordata.slots_booked

        slots_booked[slotDate]=slots_booked[slotDate].filter(e=>e!==slotTime)

        await doctorModel.findByIdAndUpdate(docId,{slots_booked})

        res.json({success:true,message:'appointment cancelled'})
    } catch (error) {
        console.error( error);
        res.json({ success: false, message: error.message });
    }
}

 
const paymentRazorpay=async(req,res)=>{

    
    try {
        const razorpayInstance=new razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET
})
       
        
        const {appointmentId}=req.body

    const appointmentdata=await appointmentModel.findById(appointmentId)

    if(!appointmentdata || appointmentdata.cancelled){
        return res.json({success:false,message:'appointment cancelled or not found'})
    }

    //creating options for payment
    const options={
        amount:appointmentdata.amount*100,
        currency:process.env.CURRENCY,
        receipt:appointmentId,
    }
    //order 
    const order=await razorpayInstance.orders.create(options)

    res.json({success:true,order})

    } catch (error) {
        console.error( error);
        res.json({ success: false, message: error.message });
    }
}

//to verify razorpay payment
const verifyrazorpay=async(req,res)=>{
    try {
        const razorpayInstance=new razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET
})
        const {razorpay_order_id}=req.body
        const orderinfo=await razorpayInstance.orders.fetch(razorpay_order_id)


        if(orderinfo.status==='paid'){
            await appointmentModel.findByIdAndUpdate(orderinfo.receipt,{payment:true})
            res.json({success:true,message:'payment successful'})

        }else{
             res.json({success:false,message:'payment failed'})
        }
    
        
    } catch (error) {
         console.error( error);
        res.json({ success: false, message: error.message });
    }
}
export {registeruser ,loginuser,getprofile ,updateuserprofile , bookappointment,listappointment,cancelappointment,paymentRazorpay,verifyrazorpay}