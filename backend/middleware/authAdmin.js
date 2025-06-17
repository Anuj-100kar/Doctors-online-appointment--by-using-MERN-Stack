import jwt from 'jsonwebtoken'

const authAdmin=async(req,res,next)=>{
    try {
        const {atoken}=req.headers
        if(!atoken){
            return res.json({sucess:false,message:'not authorized login again'})
        }
        const token_decode=jwt.verify(atoken,process.env.JWT_SECRET) 

        if(token_decode.email !==process.env.ADMIN_EMAIL || token_decode.role !== 'admin'){
            return res.json({sucess:false,message:'not authorized login again'})
        }
        req.adminEmail=token_decode.email

        next()

    } catch (error) {
        console.log(error)
        res.json({sucess:false,message:error.message})
    }
}

export default authAdmin