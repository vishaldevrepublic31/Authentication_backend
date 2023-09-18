import JWT from 'jsonwebtoken'

function isLoggedin (req,res,next) {
const token = req.headers.authorization
console.log("token",token);
if(!token) return res.status(400).json({
    success:false,
    message:'No Token Provided! '
})

JWT.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
    if(err){
        return res.status(400).json({
            success:false,
            message:'Failed to authenticate token!'
        })
    }
    req.id = decoded.id
    next();
})

}

export default isLoggedin