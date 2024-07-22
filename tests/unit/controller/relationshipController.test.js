const httpMocks = require('node-mocks-http')
const { relationshipController } = require('../../../src/controllers')
// const { relationshipService } = require('../../../src/services')

const relationshipService = require('../../../src/services/relationshipService')
const ApiError = require('../../../src/utils/ApiError')
const httpStatus = require('http-status')

jest.mock('../../../src/services/relationshipService')

describe('getAllRelationship Controller', () => {
	let req, res, next

	// Mock request and response object for each test
	beforeEach(() => {
		req = httpMocks.createRequest()
		res = httpMocks.createResponse()
		next = jest.fn()
		// next = (err) => {
		// 	expect(err.message).toBe('error fetching all identity documents')
		// }

		// Clear all mocks before each test
		jest.clearAllMocks()
	})

	it('should fetch all relationship', async () => {
		const mockRelationshipData = [
			{
				id: '668e0127aeac63de5797aeec',
				business_uid: '7A9E4330C74A2B53',
				business_name: 'Test_Firm',
				products: {},
				description: 'Description',
				isaccepted: true,
				isarchived: false,
				status: 'accepted_by_consumer',
				documents: {},
				profile: null,
				biztype: 'prof',
				email: null,
				mobile: null,
				created: 'Jul 10, 2024',
				isSpecial: false,
				tags: ['Lauditor'],
				canAccept: false,
			},
			{
				id: '66979dae22fb9154859e1488',
				isSpecial: true,
				canAccept: true,
				business_name: 'Bharathi Ganesh',
				business_category: '',
				products: [],
				description: '',
				isaccepted: false,
				isarchived: false,
				status: 'requested',
				documents: {},
				profile: {},
				biztype: 'consumer',
				email: '',
				mobile: '',
				guid: 'bharathiganeshdigicoffercom',
				tags: ['Personal'],
				profileUrl: '',
			},
		]

		relationshipService.getAllRelationship.mockResolvedValue(
			mockRelationshipData
		)

		// Call the controller function
		await relationshipController.getAllRelationship(req, res, next)
		// check the response
		expect(res.statusCode).toBe(200)

		expect(res._getJSONData()).toEqual({ data: mockRelationshipData })
	})
})
