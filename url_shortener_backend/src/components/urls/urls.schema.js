const mongoose = require('mongoose')


const schema = new mongoose.Schema(
	{
		originalUrl: {
			type: String,
			required: true,
			match: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i // Simple URL regex
		},
		shortUrl: {
			type: String,
			required: true,
			match: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i 
		},
		shortId: {
			type: String,
			required: true,
		},
		
	},
	{ timestamps: true }
)

const urlsCollection = 'urls'

schema.index({ originalUrl: 1 });
schema.index({ shortUrl: 1 }, { unique: true });
schema.index({ shortId: 1 }, { unique: true });

module.exports = {
	UrlsModel: mongoose.model(urlsCollection, schema),
	urlsCollection
}
