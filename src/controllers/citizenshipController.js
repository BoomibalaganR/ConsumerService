const httpStatus = require('http-status')
 
const catchAsync = require('../utils/catchAsync') 
const {citizenshipService} = require('../services')



exports.getAllCitizenship = catchAsync(async(req, res)=>{    
    const coffer_id =  req.user.coffer_id   
    const data =  await citizenshipService.getAllCitizenship(coffer_id)
    res.status(httpStatus.OK).json(data)
}) 

exports.getCitizenshipByCategory = catchAsync(async(req, res)=>{    
    const coffer_id =  req.user.coffer_id   
    const category = req.params.cat  
    const data =  await citizenshipService.getCitizenshipByCategory(coffer_id, category)
    res.status(httpStatus.OK).json(data)
}) 


exports.addCitizenship = catchAsync(async(req, res)=>{   
    const coffer_id =  req.user.coffer_id   
    const data =  await citizenshipService.addCitizenship(coffer_id, req.body)
    res.status(httpStatus.OK).json(data)
}) 


exports.updateCitizenship = catchAsync(async(req, res)=>{  
    const coffer_id = req.user.coffer_id 
    const category = req.params.cat  

    const data = await citizenshipService.updateCitizenship(coffer_id, category, req.body)
    res.status(httpStatus.OK).json(data)
})


exports.deleteCitizenship = catchAsync(async(req, res)=>{
    const coffer_id = req.user.coffer_id
    const category = req.params.cat   
    await citizenshipService.deleteCitizenship(coffer_id, category) 
    res.status(httpStatus.OK).json({
        'error': false, 
        'msg': 'Deleted country affiliation successfully.'})
})

exports.getCitizenshipAffiliation = catchAsync(async(req, res)=>{ 
    const country = req.params.country 
    const data = await citizenshipService.getAffiliation(country) 
    res.status(httpStatus.OK).json(data)
})