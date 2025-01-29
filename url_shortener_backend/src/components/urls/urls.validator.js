const { objectIdValidator } = require('../../core/validation')
const { checkSchema, body, query, oneOf, param } = require('express-validator')

module.exports.urlVld = [body('originalUrl').isURL().withMessage('Invalid URL format').notEmpty().withMessage('URL is required')]

module.exports.shortIdVld = [param('shortId').notEmpty().withMessage('Shortened id is required')]
