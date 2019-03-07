const Hapi = require('hapi');
const https = require('https');
const fs = require('fs');
require('dotenv').config();
const ledState = require('./led-state');

(async () => {
	if (!process.env.LOCK_PASSWORD) {
		console.error("Missing LOCK_PASSWORD env variable");
		process.exit(1);
	}

	const server = new Hapi.Server({
		port: 8333,
	});
	const options = {
		key: fs.readFileSync('/etc/letsencrypt/live/home.claybenson.me/privkey.pem'),
		cert: fs.readFileSync('/etc/letsencrypt/live/home.claybenson.me/cert.pem'),
		ca: fs.readFileSync('/etc/letsencrypt/live/home.claybenson.me/chain.pem'),
		requestCert: false,
		rejectUnauthorized: false
	};
	const httpsServer = https.createServer(options);

	let io = require('socket.io')(httpsServer);
	httpsServer.listen(8334, '0.0.0.0');
	const ledSocket = io.of('/led');
	ledSocket.on('connection', (socket) => {
		const address = socket.handshake.address;
		console.log(`${new Date().toString()}\nNew connection from ${address}\n`);
		socket.emit('set color', ledState.curColor);
		socket.emit('locked', ledState.locked);
		if (ledState.curPattern) {
			ledSocket.emit('pattern start', ledState.curPattern);
		}

		socket.on('color', (colorObj) => {
			console.log(`${new Date().toString()}\nColor set by ${address}\n`);
			if (ledState.locked) {
				socket.emit('set color', ledState.curColor);
				return;
			}
			ledState.curPattern = null;
			ledSocket.emit('pattern stop');
			ledState.setCurColor(colorObj);
			ledState.setDiodeColorObj(colorObj);
			ledSocket.emit('set color', colorObj);
		});
		socket.on('pattern start', (patternObj) => {
			console.log(`${new Date().toString()}\n${patternObj.patternName} started by ${address}\n`);
			if (ledState.locked) {
				socket.emit('set color', ledState.curColor);
				return;
			}

			if (ledState.parsePatternObj(patternObj)) {
				ledSocket.emit('pattern start', patternObj.patternName);
			}
		});
		socket.on('pattern stop', () => {
			if (ledState.locked) {
				socket.emit('set color', ledState.curColor);
				return;
			}
			ledState.curPattern = null;
			ledSocket.emit('pattern stop');
			ledState.setDiodeColorObj(ledState.curColor);
		});
		socket.on('toggle lock', (password) => {
			if (password === process.env.LOCK_PASSWORD) {
				ledState.locked = !ledState.locked;
				ledSocket.emit('locked', ledState.locked);
			}
		});
	});

	server.route([
		{
			method: 'GET',
			path: '/color',
			handler: async (req, h) => {
				if (!req.query.red || req.query.red > 255 || req.query.red < 0) {
					return h.response().code(500);
				}
				if (!req.query.green || req.query.green > 255 || req.query.green < 0) {
					return h.response().code(500);
				}
				if (!req.query.blue || req.query.blue > 255 || req.query.blue < 0) {
					return h.response().code(500);
				}
				ledState.curPattern = null;
				ledSocket.emit('pattern stop');
				let colorObj = {
					r: req.query.red,
					g: req.query.green,
					b: req.query.blue
				};
				ledState.curColor = colorObj;
				ledState.setDiodeColorObj(colorObj);
				ledSocket.emit('set color', colorObj);
				return h.response().code(200);
			}
		},
		{
			method: 'GET',
			path: '/lock',
			handler: async (req, h) => {
				ledState.locked = true;
				ledSocket.emit('locked', ledState.locked);
				return h.response.code(200);
			}
		},
		{
			method: 'GET',
			path: '/unlock',
			handler: async (req, h) => {
				ledState.locked = false;
				ledSocket.emit('locked', ledState.locked);
				return h.response.code(200);
			}
		},
		{
			method: 'GET',
			path: '/pattern-rainbow',
			handler: async (req, h) => {
				let patternObj = {
					patternName: "rainbow",
					speed: req.query.speed,
					brightnessPercent: req.query.brightness
				};
				if (ledState.parsePatternObj(patternObj)) {
					ledSocket.emit('pattern start', patternObj.patternName);
				}
				return h.response().code(200);
			}
		},
		{
			method: 'GET',
			path: '/pattern-stop',
			handler: async (req, h) => {
				ledState.curPattern = null;
				ledSocket.emit('pattern stop');
				ledState.setDiodeColorObj(ledState.curColor);
				return h.response().code(200);
			}
		},
	]);

	await server.start();

	console.log('Server running at:', server.info.uri);
})();
