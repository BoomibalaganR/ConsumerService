const Consumer = require("../models/consumer") 
const bcrypt = require("bcryptjs")

const ApiError = require('../utils/ApiError')


const consumerLogin = async(req, res, next)=>{    
    const payload = req.body
   
    const query = {}
    if (payload['email']){ 
        query["email"] =  payload['email']
    }   
    else if (payload['mobile']){   
        query["mobile"] =  payload['mobile']
    } 

    try{
        const con = await Consumer.findOne(query) 
        
        if (!con){  
            return next(new ApiError(404, 'consumer not found'))
        }    
        
        if (payload['action'] === 'login' && payload['logintype'] === 'email'){ 
            // Compare the password with the stored password
            const isMatch = await bcrypt.compare(payload['password'], con.password)
            // const isMatch = true
            if (!isMatch) { 
                return next(new ApiError(400, 'Invalid username or password'))
            }  
            
            if (!con.lastlogin && payload['logintype'] === 'email'){
                console.log('==========>>>>>> SEND WELCOME EMAIL <<<<<<==========')
            } 
            con.lastlogin = Date.now()   

            ctxt =  {'coffer_id': con.coffer_id, 
            'custom_uid': con.custom_uid,
            'first_name': con.first_name,
            'last_name': con.last_name,
            'email_verified': con.email_verified,
            'mobile_verified': con.mobile_verified,
            'lastlogin': con.lastlogin,
            'email': con.email,
            'mobile':  con.mob ? con.mob : ' ',
            'pk': con._id,
            'password_mode': con.password_mode}
            
            await con.save()
            return res.status(200).json({
                error: false, 
                message: 'Login success', 
                data: ctxt})
        } 
    }catch(err){
        return next(err)
    }

    return next(new ApiError(400, 'invalid action and logintype.'))
}


module.exports = {consumerLogin}