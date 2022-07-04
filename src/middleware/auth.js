const config = require('config');

async function keyAuth(req, res) {
	if (!req.headers.authorization) return res.unauthorized('no key');

	let [type, key] = req.headers.authorization.split(' ');

	if (type.toLowerCase() !== 'bearer')
		return res.badRequest('invalid authorization header');

	if (!config.get('auth.keys').includes(key))
		return res.unauthorized('invalid key');
	return;
}

function noAuth(req, res, next) {
	next();
}

exports.auth = () => {
	if (config.has('auth.keys')) return keyAuth;
	return noAuth;
};
