const { UrlsModel } = require(`./urls.schema`)
const { errorHandler } = require('../../core/utils/error')
const { paginateMongodb } = require('../../core/db/mongodb/pagination')
const { log } = require(`../../core/log`)

module.exports.createUrlRepo = async ({ originalUrl, shortUrl,shortId }) => {
	try {
		const createdUrl = await UrlsModel.create({originalUrl, shortUrl,shortId})
		return createdUrl
	} catch (err) {
		errorHandler({ err })
	}
}


module.exports.findOneOriginalUrlRepo = async ({ shortId }) => {
	try {
		const originalUrl = await UrlsModel.findOne({shortId}).select('originalUrl -_id').lean()
		return originalUrl
	} catch (err) {
		errorHandler({ err })
	}
}