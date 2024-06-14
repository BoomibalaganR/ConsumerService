const express = require('express')
const { validate } = require('express-validation') 

const {citizenshipValidation, authValidation} = require('../../validations') 
const {authController, citizenshipController} = require('../../controllers') 
const logger = require('../../utils/logger')

const  {authenticateToken} = require('../../middleware/authMiddleware')

const router = express.Router() 


router.use((req, res, next) => {
	logger.info(`consumer routes ${req.originalUrl}`)
	next()
})

// login
router.route('/login')
	.post(validate(authValidation.login), authController.consumerLogin) 



// authenticate jwt token for below mentioned all endpoints 
router.use(authenticateToken)

//citizenship   
router.get('/citizenship/:country/affiliations', citizenshipController.getCitizenshipAffiliation)

router.route('/citizenship')  
	.get(citizenshipController.getAllCitizenship)
	.post(validate(citizenshipValidation.createCitizenship), citizenshipController.addCitizenship)

router.route('/citizenship/:cat')   
	.get(citizenshipController.getCitizenshipByCategory)
	.put(validate(citizenshipValidation.updateCitizenship), citizenshipController.updateCitizenship)
	.delete(citizenshipController.deleteCitizenship)




module.exports = router
