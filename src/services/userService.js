const {Consumer} = require("../models")


const getConsumerByCoffer_id = async(coffer_id)=>{
    const con =  await Consumer.findOne({coffer_id: coffer_id})
    return con
}

module.exports = {
    getConsumerByCoffer_id
}