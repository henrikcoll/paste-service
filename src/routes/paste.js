const config = require('config');
const Paste = require('../models/paste');

exports.create = async (req, res) => {
	if (!req.body.content) return res.badRequest('Content is required');

	const paste = new Paste({
		title: req.body.title || 'Untitled',
		content: req.body.content,
		language: req.body.language || 'text',
	});

	await paste.save();

	return {
		slug: paste.slug,
		title: paste.title,
		content: paste.content,
		language: paste.language,
		url: paste.getUrl(),
	};
};

exports.list = async (req, res) => {
	const page = req.query.page ?? 0;
	const limit = req.query.limit ?? 25;

	const pastes = await Paste.find()
		.skip(page * limit)
		.limit(limit);

	return {
		pastes: pastes.map((paste) => ({
			slug: paste.slug,
			title: paste.title,
			language: paste.language,
			url: paste.getUrl(),
		})),
		page: {
			current: page,
			limit: limit,
			count: pastes.length,
		},
	};
};

exports.getPaste = async (req, res) => {
	const paste = await Paste.findOne({ slug: req.params.slug });

	if (!paste) return res.notFound();

	return {
		slug: paste.slug,
		title: paste.title,
		content: paste.content,
		language: paste.language,
		url: paste.getUrl(),
	};
};

exports.remove = async (req, res) => {
	const paste = await Paste.findOne({ slug: req.params.slug });

	if (!paste) return res.notFound();

	await paste.remove();

	res.status(200).send();
};

exports.update = async (req, res) => {
	if (!req.body.target && !req.body.content && !req.body.language)
		return res.badRequest('Title, content or language is required');

	const paste = await Paste.findOne({ slug: req.params.slug });

	if (!paste) return res.notFound();

	if (req.body.title) paste.content = req.body.content;
	if (req.body.content) paste.content = req.body.content;
	if (req.body.language) paste.language = req.body.language;

	await paste.save();

	return {
		slug: paste.slug,
		title: paste.title,
		content: paste.content,
		language: paste.language,
		url: paste.getUrl(),
	};
};
