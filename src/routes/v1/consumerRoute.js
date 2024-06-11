const express = require('express')
const { validate } = require('express-validation') 

const {citizenshipValidation, authValidation} = require('../../validations') 
const {authController, citizenshipController} = require('../../controllers') 
const logger = require('../../utils/logger')

const router = express.Router() 


router.use((req, res, next) => {
	logger.info(`consumer routes ${req.originalUrl}`)
	next()
})


// login
router.route('/identify')
	.post(validate(authValidation.login), authController.consumerLogin) 


//citizenship  
router.get('/citizenship/:country/affiliations', citizenshipController.getCitizenshipAffiliation)

router.route('/:coffer_id/citizenship') 
	.post(validate(citizenshipValidation.createCitizenship), citizenshipController.addCitizenship)

router.route('/:coffer_id/citizenship/:cat') 
	.put(validate(citizenshipValidation.updateCitizenship), citizenshipController.updateCitizenship)
	.delete(citizenshipController.deleteCitizenship)



module.exports = router
