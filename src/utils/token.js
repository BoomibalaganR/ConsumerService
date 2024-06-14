const jwt = require('jsonwebtoken')
require('dotenv').config({ path: "./config.env" })

const SECRET_KEY = process.env.JWT_SECRET_KEY 
const JWT_EXPIRE = process.env.JWT_EXPIRE


// Function to generate JWT token
const generateToken = (con) => { 
    
    // Define payload
    const payload = {
        coffer_id: con.coffer_id, 
        pk: con.pk
    }
    // console.log(payload)
    
    // with secret key to generate JWT token 
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: JWT_EXPIRE })
    return token
}


module.exports = {generateToken}