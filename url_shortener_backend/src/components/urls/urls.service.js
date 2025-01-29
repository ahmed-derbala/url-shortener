const { UrlsModel } = require(`./urls.schema`)
const { errorHandler } = require('../../core/utils/error')
const { log } = require('../../core/log')
const { createUrlRepo, findOneOriginalUrlRepo } = require('./urls.repository')
const config = require(`../../config`)
const redisClient = require('../../core/db/redis')

/**
 * Creates a shortened URL and stores it in the repository and Redis cache.
 *
 * @async
 * @function createShortUrlSrvc
 * @param {Object} params - The parameters for creating a short URL.
 * @param {string} params.originalUrl - The original URL to be shortened.
 * @param {string} params.shortId - The unique short identifier for the URL.
 * @returns {Object} The created URL object containing the original URL, short URL, and short ID.
 * @throws Will call the errorHandler if an error occurs during the process.
 */
module.exports.createShortUrlSrvc = async ({ originalUrl, shortId }) => {
	try {
		const shortUrl = `${config.frontend.url}/${shortId}`
		const createdUrl = await createUrlRepo({ originalUrl, shortUrl, shortId })
		redisClient.set(shortUrl, originalUrl)

		return createdUrl
	} catch (err) {
		errorHandler({ err })
	}
}

/**
 * Retrieves the original URL based on the given short ID. Checks Redis cache first before querying the repository.
 *
 * @async
 * @function findOneOriginalUrlSrvc
 * @param {Object} params - The parameters for finding the original URL.
 * @param {string} params.shortId - The unique short identifier for the URL.
 * @returns {string} The original URL associated with the short ID.
 * @throws Will call the errorHandler if an error occurs during the process.
 */
module.exports.findOneOriginalUrlSrvc = async ({ shortId }) => {
	try {
		redisClient.get(shortId, async (err, cachedUrl) => {
			if (err) {
				return errorHandler({ err })
			}

			if (cachedUrl) {
				return cachedUrl
			}
		})
		const originalUrl = await findOneOriginalUrlRepo({ shortId })
		return originalUrl
	} catch (err) {
		errorHandler({ err })
	}
}
