'use strict';

require('dotenv').config();

const Hapi = require('hapi');
const https = require('https');
const fs = require('fs');
const pb = require('pi-blaster.js');
const Bulb = require('bulb');

function setDiodeColor(color) {
	const r = Math.round(color.r);
	const g = Math.round(color.g);
	const b = Math.round(color.b);

	if (r < 0 || r > 255) { return; }
	if (g < 0 || g > 255) { return; }
	if (b < 0 || b > 255) { return; }

	pb.setPwm(17, (r / 255).toFixed(2));
	pb.setPwm(24, (g / 255).toFixed(2));
	pb.setPwm(22, (b / 255).toFixed(2));
}
const bulb = new Bulb({ r: 255, g: 180, b: 0 }, setDiodeColor);

(async () => {
	if (!process.env.LOCK_PASSWORD) {
		console.error("Missing LOCK_PASSWORD env variable");
		process.exit(1);
	}

	let locked = false;
	const server = new Hapi.Server({
		port: 8333,
	});
	const options = {
		key: fs.readFileSync(process.env.KEY_PATH),
		cert: fs.readFileSync(process.env.CERT_PATH),
		ca: fs.readFileSync(process.env.CA_PATH),
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
		socket.emit('set color', bulb.getColor());
		socket.emit('locked', locked);
		if (bulb.getPattern()) {
			ledSocket.emit('pattern start', bulb.getPattern());
		}

		socket.on('color', (colorObj) => {
			console.log(`${new Date().toString()}\nColor set by ${address}\n`);
			if (locked) {
				socket.emit('set color', bulb.getColor());
				return;
			}
			if (bulb.getPattern()) {
				bulb.stopPattern();
				ledSocket.emit('pattern stop');
			}

			bulb.setColor(colorObj);
			ledSocket.emit('set color', colorObj);
		});
		socket.on('pattern start', (patternObj) => {
			console.log(`${new Date().toString()}\n${patternObj.patternName} started by ${address}\n`);
			if (locked) {
				socket.emit('set color', bulb.getColor());
				return;
			}

			try {
				bulb.startPattern(patternObj);
				ledSocket.emit('pattern start', patternObj.patternName);
			} catch (e) {
				console.error(e);
			}
		});
		socket.on('pattern stop', () => {
			if (locked) {
				socket.emit('set color', bulb.getColor());
				return;
			}
			if (bulb.getPattern()) {
				bulb.stopPattern();
				ledSocket.emit('pattern stop');
			}
		});
		socket.on('toggle lock', (password) => {
			if (password === process.env.LOCK_PASSWORD) {
				locked = !locked;
				ledSocket.emit('locked', locked);
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

				if (bulb.getPattern()) {
					bulb.stopPattern();
					ledSocket.emit('pattern stop');
				}

				let colorObj = {
					r: req.query.red,
					g: req.query.green,
					b: req.query.blue
				};
				bulb.setColor(colorObj);
				ledSocket.emit('set color', colorObj);
				return h.response().code(200);
			}
		},
		{
			method: 'GET',
			path: '/lock',
			handler: async (req, h) => {
				locked = true;
				ledSocket.emit('locked', locked);
				return h.response.code(200);
			}
		},
		{
			method: 'GET',
			path: '/unlock',
			handler: async (req, h) => {
				locked = false;
				ledSocket.emit('locked', locked);
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
				try {
					bulb.startPattern(patternObj);
					ledSocket.emit('pattern start', patternObj.patternName);
				} catch (e) {
					console.error(e);
				}
				return h.response().code(200);
			}
		},
		{
			method: 'GET',
			path: '/pattern-stop',
			handler: async (req, h) => {
				if (bulb.getPattern()) {
					bulb.stopPattern();
					ledSocket.emit('pattern stop');
				}
				return h.response().code(200);
			}
		},
	]);

	await server.start();

	console.log('Server running at:', server.info.uri);
})();