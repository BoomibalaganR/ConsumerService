const { Consumer } = require('../models')

/**
 * Retrieves a consumer from the database based on the coffer_id.
 * 
 * @param {string} coffer_id - The unique identifier of the consumer.
 * @returns {Promise<Object|null>} - A promise that resolves to the consumer object if found, 
 *                                   or null if not found.
 */
const getConsumerByCoffer_id = async (coffer_id) => {
    const con = await Consumer.findOne({ coffer_id: coffer_id })
    return con
}

module.exports = {
    getConsumerByCoffer_id
}
