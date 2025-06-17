import {v2 as cloudinary} from 'cloudinary'

const connectcloudinary=async()=>{
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY // Changed 'secret_key' to 'api_secret'
    })
    console.log('Cloudinary configuration loaded successfully.'); // Add a log for confirmation
}

export default connectcloudinary;