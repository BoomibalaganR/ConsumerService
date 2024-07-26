const axios = require('axios')
const logger = require('../../config/logger')

const GATEWAY_URI = 'https......'

/**
 * Get category data from the document microservice.
 *
 * @param {string} cat - Category identifier
 * @param {string} token - Authorization token
 * @returns {Promise<object>} Category data
 */

exports.getIdentityDocumentById = async (doc_id, token) => {
	return Promise.resolve({
		category: 'citizen_primary',
		doctype: 'driver_license',
		docid: '888888888888',
		expiration_date: 'Jun 26, 2024',
		content_type: 'image/png',
		filename: 'login_app (4).png',
		filesize: 158500,
		created: 'Jun 19, 2024',
		verification_status: 'NotVerified',
		validity_status: 'Valid',
		tags: ['Identity'],
		country: 'India',
		id: '6672a7ffaeac634f1a8aba56',
		url: 'https......'
	})

	// try {
	// 	const response = await axios.get(
	// 		`${GATEWAY_URI}/api/v1/document/doc/${doc_id}`,
	// 		{
	// 			headers: {
	// 				Authorization: token
	// 			},
	// 			validateStatus: function (status) {
	// 				return true // Resolve for all status codes
	// 			}
	// 		}
	// 	)
	// 	logger.info(
	// 		`Successfully retrieved ${doc_id} document from document service`
	// 	)
	// 	return { data: response.data, exists: true }
	// } catch {
	// 	return { data: doc_id, exists: false }
	// }
}
