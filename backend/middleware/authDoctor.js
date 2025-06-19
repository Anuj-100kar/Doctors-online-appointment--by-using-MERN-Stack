import jwt from 'jsonwebtoken'

const authDoctor=async(req,res,next)=>{
    try {
        const {dtoken}=req.headers
        if(!dtoken){
            return res.json({sucess:false,message:'not authorized login again'})
        }
        const token_decode=jwt.verify(dtoken,process.env.JWT_SECRET) 

        req.docId=token_decode.id

        next()

    } catch (error) {
        console.log(error)
        return res.json({sucess:false,message:error.message})
    }
}

export default authDoctor