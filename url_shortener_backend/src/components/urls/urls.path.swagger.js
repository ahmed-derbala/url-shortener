const { urlsTag } = require('./urls.tag.swagger.js')

module.exports = {
	'/api/urls/shorten': {
		post: {
			tags: [urlsTag.name],
			summary: 'create short url',
			description: 'create short url from a long url',
			operationId: 'shorten',
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					in: 'body',
					description: 'body description',
					name: 'bodyName',
					schema: {
						type: 'object',
						properties: {
							originalUrl: {
								type: 'string',
								default: 'https://fb.com',
								required: false,
								description: 'a sample long url'
							}
						}
					}
				}
			],
			components: {
				securitySchemes: {
					bearerAuth: {
						type: 'http',
						scheme: 'bearer',
						bearerFormat: 'JWT'
					}
				}
			},
			security: [{ bearerAuth: [] }], //components.securitySchemes and security are a must to send JWT
			responses: {
				200: {
					description: 'responses is a must to execute the request'
				},
				'resp-example': {
					description: 'example description',
					schema: {
						type: 'object',
						properties: {
							id: {
								type: 'integer',
								default: 'ahmed.derbala@esprit.tn',
								required: false,
								description: 'user id'
							},
							name: {
								type: 'string',
								default: '12345678',
								required: false,
								description: 'user name'
							}
						}
					}
				}
			} //responses is a must to execute the request
		}
	},

	'/api/urls/{shortId}': {
		get: {
			tags: [urlsTag.name],
			summary: 'get originalUrl based on shortId',
			description: 'get originalUrl based on shortId',
			operationId: 'retrieve',
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					in: 'path',
					description: 'shortId',
					name: 'shortId'
				}
			],
			components: {
				securitySchemes: {
					bearerAuth: {
						type: 'http',
						scheme: 'bearer',
						bearerFormat: 'JWT'
					}
				}
			},
			security: [{ bearerAuth: [] }], //components.securitySchemes and security are a must to send JWT
			responses: {
				200: {
					description: 'responses is a must to execute the request'
				},
				'resp-example': {
					description: 'example description',
					schema: {
						type: 'object',
						properties: {
							id: {
								type: 'integer',
								default: 'ahmed.derbala@esprit.tn',
								required: false,
								description: 'user id'
							},
							name: {
								type: 'string',
								default: '12345678',
								required: false,
								description: 'user name'
							}
						}
					}
				}
			} //responses is a must to execute the request
		}
	}
}
