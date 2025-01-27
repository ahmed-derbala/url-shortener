/**
 * @file URL Shortener API Endpoints
 * @description Provides endpoints for creating and resolving shortened URLs.
 */

const express = require('express')
const router = express.Router()
const { createShortUrlSrvc, findOneOriginalUrlSrvc } = require(`./urls.service`)
const { errorHandler } = require('../../core/utils/error')
const { log } = require('../../core/log')
const { resp } = require('../../core/helpers/resp')
const { urlVld, shortIdVld } = require('./urls.validator')
const { validate } = require('../../core/validation')
const shortid = require('shortid');



/**
 * @api {post} /shorten Shorten a URL
 * @apiName ShortenURL
 * @apiGroup URL
 * @apiDescription Generates a shortened URL for the given original URL.
 *
 * @apiBody {String} originalUrl The original URL to shorten.
 *
 * @apiSuccess {Number} status HTTP status code.
 * @apiSuccess {Object} data The data object containing details about the shortened URL.
 * @apiSuccess {String} data.originalUrl The original URL.
 * @apiSuccess {String} data.shortUrl The generated shortened URL.
 * @apiSuccess {String} data.shortId The unique identifier for the shortened URL.
 *
 * @apiError {Number} status HTTP status code.
 * @apiError {Object} error Error details.
 *
 * @apiExample {curl} Example usage:
 *    curl -X POST https://yourdomain.com/shorten \
 *    -H "Content-Type: application/json" \
 *    -d '{"originalUrl": "https://example.com/some/long/url"}'
 */
router.post('/shorten', validate(urlVld), async (req, res) => {
	try {
		const { originalUrl } = req.body
		const shortId = shortid.generate();
		const data = await createShortUrlSrvc({ originalUrl, shortId })
		return resp({ status: 200, data, req, res })
	} catch (err) {
		errorHandler({ err, req, res })
	}
})


/**
 * @api {get} /:shortId Resolve a Shortened URL
 * @apiName ResolveURL
 * @apiGroup URL
 * @apiDescription Resolves the original URL for the given short ID.
 *
 * @apiParam {String} shortId The unique identifier for the shortened URL.
 *
 * @apiSuccess {Number} status HTTP status code.
 * @apiSuccess {String} data The original URL corresponding to the short ID.
 *
 * @apiError {Number} status HTTP status code.
 * @apiError {Object} error Error details.
 * @apiErrorExample {json} 404 Not Found:
 *    {
 *      "status": 404,
 *      "error": "URL not found"
 *    }
 *
 * @apiExample {curl} Example usage:
 *    curl -X GET https://yourdomain.com/abc123
 */
router.get('/:shortId', validate(shortIdVld), async (req, res) => {
	try {
		const { shortId } = req.params
		const data = await findOneOriginalUrlSrvc({ shortId })
		const status = data ? 200 : 404
		return resp({ status, data, req, res })
	} catch (err) {
		errorHandler({ err, req, res })
	}
})


module.exports = router
