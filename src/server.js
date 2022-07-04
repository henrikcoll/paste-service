const fastify = require('fastify')();
const mongoose = require('mongoose');
const config = require('config');
const path = require('path');

const authMiddleware = require('./middleware/auth');

const showRoutes = require('./routes/show');
const pasteRoutes = require('./routes/paste');

exports.start = async () => {
	fastify.register(require('@fastify/sensible'));
	fastify.register(require('@fastify/cors'), {
		methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
	});

	fastify.register(require('@fastify/static'), {
		root: path.join(__dirname, '../public'),
		prefix: '/public/paste',
	});

	fastify.register(require('@fastify/static'), {
		root: path.join(__dirname, '../node_modules/@highlightjs/cdn-assets'),
		prefix: '/public/paste/hljs',
		decorateReply: false,
	});

	fastify.register(require('@fastify/view'), {
		engine: {
			ejs: require('ejs'),
		},
		root: path.join(__dirname, '../views'),
		viewExt: 'ejs',
		layout: 'layouts/main',
	});

	fastify.get(`${config.get('publicUrl.urlPrefix')}:slug`, showRoutes.show);
	fastify.get(
		`${config.get('publicUrl.urlPrefix')}:slug/raw`,
		showRoutes.showRaw
	);
	fastify.get(
		'/api/v1/pastes',
		{ preHandler: authMiddleware.auth() },
		pasteRoutes.list
	);
	fastify.post(
		'/api/v1/pastes',
		{ preHandler: authMiddleware.auth() },
		pasteRoutes.create
	);
	fastify.delete(
		'/api/v1/pastes/:slug',
		{ preHandler: authMiddleware.auth() },
		pasteRoutes.remove
	);
	fastify.put(
		'/api/v1/pastes/:slug',
		{ preHandler: authMiddleware.auth() },
		pasteRoutes.update
	);

	mongoose.connect(config.get('mongo.url'));
	fastify.listen(config.get('http.port'), config.get('http.addr'));
};
