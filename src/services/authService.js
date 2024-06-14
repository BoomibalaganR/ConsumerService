const Consumer = require("../models/consumer")
const ApiError = require("../utils/ApiError")
const logger = require("../utils/logger")  
const httpStatus = require('http-status') 


const {generateToken} = require('../utils/token')


exports.login = async (query, password)=> { 

    const con = await Consumer.findOne(query)
    if (!con ) {
        throw new ApiError(httpStatus.NOT_FOUND, 'consumer not found');
    }  
    
    if (! await con.isPasswordMatch(password)) { 
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid email or password');
    }   

    if (!con.lastlogin) {
            console.log(
                "==========>>>>>> SEND WELCOME EMAIL <<<<<<=========="
            )
    } 

    con.lastlogin = Date.now()

    const ctxt = {
        coffer_id: con.coffer_id,
        custom_uid: con.custom_uid,
        first_name: con.first_name,
        last_name: con.last_name,
        email_verified: con.email_verified,
        mobile_verified: con.mobile_verified,
        lastlogin: con.lastlogin,
        email: con.email,
        mobile: con.mob ? con.mob : '',
        pk: con._id,
        password_mode: con.password_mode,
    }

    await con.save()
    logger.info(`${con.first_name} - Login successful`) 
    
    token = generateToken(ctxt)
    return {
        error: false,
        token: token,
        data: ctxt,
    }
} 


	
