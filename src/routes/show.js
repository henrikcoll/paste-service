const Paste = require('../models/paste');

exports.show = async (req, res) => {
	const paste = await Paste.findOne({ slug: req.params.slug });
	return await res.view('show', {
		title: paste.title,
		paste,
	});
};

exports.showRaw = async (req, res) => {
	const paste = await Paste.findOne({ slug: req.params.slug });
	return await res.send(paste.content);
};
