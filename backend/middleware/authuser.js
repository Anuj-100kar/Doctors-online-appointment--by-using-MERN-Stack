import jwt from 'jsonwebtoken'

const authuser=async(req,res,next)=>{
    try {
        const {token}=req.headers
        if(!token){
            return res.json({sucess:false,message:'not authorized login again'})
        }
        const token_decode=jwt.verify(token,process.env.JWT_SECRET) 

        req.userId=token_decode.id

        next()

    } catch (error) {
        console.log(error)
        return res.json({sucess:false,message:error.message})
    }
}

export default authuser