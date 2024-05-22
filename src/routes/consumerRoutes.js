const express = require('express')
const router = express.Router()   

const consumerController = require('../controllers/consumerController') 
const {validatePayload} = require('../utils/validate') 
const {LoginModel} = require('../models/login')




router
.post('/login', validatePayload(LoginModel), consumerController.consumerLogin)



module.exports = router
