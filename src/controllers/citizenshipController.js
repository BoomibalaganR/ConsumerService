const httpStatus = require('http-status')
 
const catchAsync = require('../utils/catchAsync') 
const {citizenshipRepository} = require('../repository')



exports.getAllCitizenship = catchAsync(async(req, res)=>{    
    const coffer_id =  req.user.coffer_id    
    // const coffer_id = req.headers['x-coffer-id']
    const data =  await citizenshipRepository.getAllCitizenship(coffer_id)
    res.status(httpStatus.OK).json(data)
}) 

exports.getCitizenshipByCategory = catchAsync(async(req, res)=>{    
    const coffer_id =  req.user.coffer_id   
    const category = req.params.cat  
    const data =  await citizenshipRepository.getCitizenshipByCategory(coffer_id, category)
    res.status(httpStatus.OK).json(data)
}) 


exports.addCitizenship = catchAsync(async(req, res)=>{   
    const coffer_id =  req.user.coffer_id   
    const data =  await citizenshipRepository.addCitizenship(coffer_id, req.body)
    res.status(httpStatus.OK).json(data)
}) 


exports.updateCitizenship = catchAsync(async(req, res)=>{  
    const coffer_id = req.user.coffer_id 
    const category = req.params.cat  

    const data = await citizenshipRepository.updateCitizenship(coffer_id, category, req.body)
    res.status(httpStatus.OK).json(data)
})


exports.deleteCitizenship = catchAsync(async(req, res)=>{
    const coffer_id = req.user.coffer_id
    const category = req.params.cat   
    await citizenshipRepository.deleteCitizenship(coffer_id, category) 
    res.status(httpStatus.OK).json({
        'error': false, 
        'msg': 'Deleted country affiliation successfully.'})
})

exports.getCitizenshipAffiliation = catchAsync(async(req, res)=>{ 
    const country = req.params.country 
    const data = await citizenshipRepository.getAffiliation(country) 
    res.status(httpStatus.OK).json(data)
})