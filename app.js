const express = require('express') 
const app = express()  
const dotenv = require("dotenv") 
const bodyParser = require('body-parser')  
const mongoose = require('mongoose')


const errorMiddleware = require('./src/middleware/errorMiddleware')
const consumerRoutes = require('./src/routes/consumerRoutes') 
const ApiError  = require('./src/utils/ApiError') 

dotenv.config({path: "./Config.env"}) 


const uri = process.env.MONGODB_URI
// connect to mongoDB 
mongoose.connect(uri)
.then(()=>console.log('db connection established')) 
.catch((err)=>console.log(err.message)) 



app.use(bodyParser.json())
app.use('/consumer', consumerRoutes) 


app.all("*", (req, res, next)=>{
    next(new ApiError(400, `Can't find ${req.originalUrl} on this server`))  
})


// Handle the error GLOBALLY
app.use(errorMiddleware)

module.exports = app
