const mongoose = require('mongoose');
const config = require('config');
const { customAlphabet } = require('nanoid');
const mime = require('mime');

/* same as https://github.com/ai/nanoid/blob/21728dc49e89cd99bf789f30a4d2306c5fc7b309/url-alphabet/index.js,
	 but without "-" and "_". */
const nanoid = customAlphabet(
	'useandom26T198340PX75pxJACKVERYMINDBUSHWOLFGQZbfghjklqvwyzrict',
	5
);

const PasteSchema = new mongoose.Schema(
	{
		slug: {
			type: String,
			unique: true,
			index: true,
			default: () => nanoid(),
		},
		title: {
			type: String,
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		language: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

PasteSchema.methods.getUrl = function getUrl() {
	return `${config.get('publicUrl.protocol')}://${config.get(
		'publicUrl.host'
	)}${config.get('publicUrl.urlPrefix')}${this.slug}`;
};

PasteSchema.methods.getExtension = function getFileName() {
	return mime.getExtension(this.language);
};

PasteSchema.methods.getFileName = function getFileName() {
	return `${this.slug}.${mime.getExtension(this.language)}`;
};

const Paste = mongoose.model('Paste', PasteSchema);

module.exports = Paste;
