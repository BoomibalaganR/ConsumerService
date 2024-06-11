const {Consumer} = require("../models")
const ApiError = require("../utils/ApiError")
const logger = require("../utils/logger")  
const httpStatus = require('http-status') 

const userService = require('./userService') 
const {AFFILIATIONS, INDIA_AFFILIATIONS} = require('../utils/constants')


const getAffiliation=  async(country)=>{    

    afl= country === 'India'? INDIA_AFFILIATIONS : AFFILIATIONS  

    const affiliations = []
    for (const [name, type] of Object.entries(afl)) {
        affiliations.push({
            aflType: type,
            aflName: name
        })
    } 
    logger.info("successfully return affiliation.") 
    return affiliations
}


const addCitizenship = async(coffer_id, payload)=>{  
    const con = await userService.getConsumerByCoffer_id(coffer_id) 
    if (!con) {
        throw new ApiError(httpStatus.NOT_FOUND, 'consumer not found');
    } 

    let citizenships = con.hasCitizenship() 
    if (!citizenships){  
        throw new ApiError(httpStatus.BAD_REQUEST, "Too many citizenships.")
    } 

    payload['index'] = citizenships 
    con.citizen.push(payload) 
    await con.save()  

    logger.info("successfully created citizenships.") 
    return con
} 

const updateCitizenship =  async(coffer_id, category, payload)=>{

    const con = await userService.getConsumerByCoffer_id(coffer_id) 
    if (!con) {
        throw new ApiError(httpStatus.NOT_FOUND, 'consumer not found')
    }  

    const updateFields = {}
    for (const key in payload) {
        updateFields[`citizen.$.${key}`] = payload[key]
    }  

    const updatedConsumer = await Consumer.findOneAndUpdate(
                            { 
                                coffer_id: coffer_id, 
                                'citizen.index': category 
                            },
                            { 
                                $set: updateFields
                            },
                            { 
                                new: true, 
                                runValidators: true 
                            }) 
                                            
    if (!updatedConsumer) {
        throw new ApiError(httpStatus.NOT_FOUND, `Citizenship ${category} not found.`)
    }  
    
    logger.info(`successfully updated ${category}`)
    return updatedConsumer
}  

const deleteCitizenship = async(coffer_id, category)=>{ 
    if(category === 'citizen_primary'){
        logger.info('Primary affiliation cannot be deleted.')
        throw new ApiError(400, 'Primary affiliation cannot be deleted.')
    }
    
    const con = await getConsumerByCoffer_id(coffer_id) 
    if (!con) {
        throw new ApiError(httpStatus.NOT_FOUND, 'consumer not found')
    }   
        // check all documents are deleted under the affiliation  
        //if not deleted, return first delete digital documents, 
        //before deleting this Country Affiliation

    const result = await Consumer.updateOne(
                    { 
                        coffer_id: coffer_id, 
                        'citizen.index': category 
                    },
                    { 
                        $pull: { 
                        citizen: { index: category } 
                        } 
                    },
                    { new: true }) 
    if (result.matchedCount === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, `Citizenship ${category} not found.`)
    } 
} 



module.exports = {
    addCitizenship, 
    updateCitizenship,
    deleteCitizenship,
    getAffiliation
}