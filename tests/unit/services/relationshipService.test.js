const { relationshipService } = require('../../../src/services')
const { SpecialRelationship, Consumer } = require('../../../src/models')

const httpStatus = require('http-status')
const ApiError = require('../../../src/utils/ApiError')

// mock the identity model
jest.mock('../../../src/models/specialRelationship')
jest.mock('../../../src/models/consumer')

describe('getAllRelationship service', () => {
	const cofferId = 'sampleCofferId'
	let mockConsumer, mockRelationshipsData

	beforeEach(() => {
		mockConsumer = {
			fullName: jest.fn().mockReturnValue('Boomibalagan R'),
			customUid: jest.fn().mockReturnValue('boomibalagangmailcom'),
			getProfilepicViewUrl: jest
				.fn()
				.mockReturnValue('http://example.com/profile.jpg')
		}

		mockRelationshipsData = [
			{
				_id: 'relationshipId1',
				acceptor_uid: cofferId,
				requestor_uid: 'requestorCofferId1',
				acceptor_tags: ['personal'],
				requestor_type: 'consumer',
				isaccepted: false,
				status: 'pending'
			},
			{
				_id: 'relationshipId2',
				acceptor_uid: 'acceptorCofferId2',
				requestor_uid: cofferId,
				requestor_tags: ['personal'],
				acceptor_type: 'consumer',
				isaccepted: true,
				status: 'completed'
			}
		]

		jest.clearAllMocks()
	})

	it('should return relationships with correct data', async () => {
		// Mock data

		Consumer.findByCofferId.mockResolvedValue(mockConsumer)
		SpecialRelationship.find.mockResolvedValue(mockRelationshipsData)

		const result = await relationshipService.getAllRelationship(cofferId)

		expect(result).toEqual({
			relationships: [
				{
					id: 'relationshipId1',
					isSpecial: true,
					canAccept: true,
					business_name: 'Boomibalagan R',
					business_category: '',
					products: [],
					description: '',
					isaccepted: false,
					isarchived: false,
					status: 'pending',
					documents: {},
					profile: {},
					biztype: 'consumer',
					email: '',
					mobile: '',
					guid: 'boomibalagangmailcom',
					tags: ['personal'],
					profileUrl: 'http://example.com/profile.jpg'
				},
				{
					id: 'relationshipId2',
					isSpecial: true,
					canAccept: false,
					business_name: 'Boomibalagan R',
					business_category: '',
					products: [],
					description: '',
					isaccepted: true,
					isarchived: false,
					status: 'completed',
					documents: {},
					profile: {},
					biztype: 'consumer',
					email: '',
					mobile: '',
					guid: 'boomibalagangmailcom',
					tags: ['personal'],
					profileUrl: 'http://example.com/profile.jpg'
				}
			]
		})
	})

	it('should return an empty array if no relationships exist for the consumer', async () => {
		// Mock consumer object
		const mockConsumer = { coffer_id: cofferId }

		Consumer.findByCofferId.mockResolvedValue(mockConsumer)

		//  no relationships found
		SpecialRelationship.find.mockResolvedValue([])

		const relationships = await relationshipService.getAllRelationship(
			cofferId
		)

		expect(relationships).toEqual({ relationships: [] })
	})

	it('should throw an error if consumer is not found', async () => {
		Consumer.findByCofferId.mockResolvedValue(null)

		await expect(
			relationshipService.getAllRelationship(cofferId)
		).rejects.toThrow(
			new ApiError(httpStatus.NOT_FOUND, 'Consumer not found')
		)
	})

	// Add more test cases as needed for different scenarios
})

describe('requestRelationship service', () => {
	let requestorCofferId, acceptorId, description
	beforeEach(() => {
		requestorCofferId = 'reqcofferid'
		acceptorId = 'acceptorId'
		description = 'please accept the request'
		jest.clearAllMocks()
	})

	it('should throw an error if requestor consumer is not found', async () => {
		//mock function to find consumer
		Consumer.findByCofferId.mockResolvedValue(null)

		await expect(
			relationshipService.requestRelationship(requestorCofferId, {
				consumerId: acceptorId,
				description: description
			})
		).rejects.toThrow(
			new ApiError(httpStatus.NOT_FOUND, 'Consumer not found')
		)
	})

	it('should throw an error if acceptor consumer is not found', async () => {
		Consumer.findByCofferId.mockResolvedValue({
			coffer_id: 'requestorCofferId'
		})
		// stimulate no acceptor consumer found
		Consumer.findById.mockResolvedValue(null)

		await expect(
			relationshipService.requestRelationship(requestorCofferId, {
				consumerId: acceptorId,
				description: description
			})
		).rejects.toThrow(
			new ApiError(httpStatus.NOT_FOUND, 'Acceptor Account not found')
		)
	})

	it('should throw an error if requestor and acceptor consumers are the same', async () => {
		Consumer.findByCofferId.mockResolvedValue({
			coffer_id: requestorCofferId
		})
		Consumer.findById.mockResolvedValue({ coffer_id: requestorCofferId })

		await expect(
			relationshipService.requestRelationship(requestorCofferId, {
				consumerId: acceptorId,
				description: description
			})
		).rejects.toThrow(
			new ApiError(httpStatus.BAD_REQUEST, 'Operation not permitted.')
		)
	})

	it('should throw an error if the relationship already exists', async () => {
		Consumer.findByCofferId.mockResolvedValue({
			coffer_id: requestorCofferId
		})
		Consumer.findById.mockResolvedValue({ coffer_id: 'acceptorCofferId' })

		// Simulate existing relationship
		SpecialRelationship.exists.mockResolvedValue(true)

		await expect(
			relationshipService.requestRelationship(requestorCofferId, {
				consumerId: acceptorId,
				description: description
			})
		).rejects.toThrow(
			new ApiError(httpStatus.BAD_REQUEST, 'Relationship Already Exit')
		)
	})

	it('should create a new relationship successfully', async () => {
		const mockData = {
			_id: 'newId',
			acceptor_uid: 'acceptorCofferId',
			requestor_uid: 'requestorCofferId',
			description: description
		}

		Consumer.findByCofferId.mockResolvedValue({
			coffer_id: requestorCofferId
		})
		Consumer.findById.mockResolvedValue({ coffer_id: 'acceptorCofferId' })
		SpecialRelationship.exists.mockResolvedValue(false) // Simulate no existing relationship
		SpecialRelationship.create.mockResolvedValue(mockData)

		const result = await relationshipService.requestRelationship(
			requestorCofferId,
			{
				consumerId: acceptorId,
				description: description
			}
		)

		expect(result).toEqual({
			message: 'Request sent successfully.',
			data: mockData
		})
	})
})

describe('acceptRelationship service', () => {
	const acceptorCofferId = 'acceptorCofferId123'
	const relationshipId = 'relationship_id'

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should throw an error if consumer is not found', async () => {
		Consumer.findByCofferId.mockResolvedValue(null)

		await expect(
			relationshipService.acceptRelationship(
				acceptorCofferId,
				relationshipId
			)
		).rejects.toThrow(
			new ApiError(httpStatus.NOT_FOUND, 'Account not found.')
		)
	})

	it('should throw an error if relationship is not found or invalid acceptor ID', async () => {
		Consumer.findByCofferId.mockResolvedValue({
			coffer_id: acceptorCofferId
		})
		SpecialRelationship.findOne.mockResolvedValue(null)

		await expect(
			relationshipService.acceptRelationship(
				acceptorCofferId,
				relationshipId
			)
		).rejects.toThrow(
			new ApiError(
				httpStatus.NOT_FOUND,
				'Relationship not found or invalid acceptor ID.'
			)
		)
	})

	it('should successfully accept the relationship', async () => {
		// Mock Consumer.findByCofferId to return a consumer
		Consumer.findByCofferId.mockResolvedValue({ _id: acceptorCofferId })

		// Mock SpecialRelationship.findOne to return a relationship
		const mockRelationship = {
			isaccepted: false,
			save: jest.fn().mockResolvedValue({
				isaccepted: true,
				accepted_date: Date.now(),
				status: 'accepted'
			})
		}
		SpecialRelationship.findOne.mockResolvedValue(mockRelationship)

		// Call the function
		const result = await relationshipService.acceptRelationship(
			acceptorCofferId,
			relationshipId
		)

		// Assert the result
		expect(result).toEqual({
			message: 'Relationship successfully accepted'
		})

		// Assert that methods were called with expected arguments
		expect(Consumer.findByCofferId).toHaveBeenCalledWith(acceptorCofferId)
		expect(SpecialRelationship.findOne).toHaveBeenCalledWith({
			_id: relationshipId,
			acceptor_uid: acceptorCofferId
		})
		expect(mockRelationship.save).toHaveBeenCalled()
	})
})
