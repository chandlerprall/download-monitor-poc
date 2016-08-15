'use strict';

const fs = require('fs');
const express = require('express');
const app = express();

const pagetemplate = fs.readFileSync('index.html');
app.get(
	'/',
	(req, res) => {
		res.end(pagetemplate);
	}
);

const chars = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9','0'];
let payload = '';
const payloadsize = 1024 * 1024; // 1Mb
for (let i = 0; i < payloadsize; i++) {
	payload += chars[Math.round(Math.random() * chars.length)];
}
const payloadchunks = 5;
const payloadchunksize = payloadsize / payloadchunks;
const payloaddelay = 1000;
app.get(
	'/file',
	(req, res) => {
		res.set('Content-Type', 'text/plain');
		res.set('Content-Length', payloadsize);

		let payloadssent = 0;
		const payloadinterval = setInterval(
			() => {
				res.write(payload.slice(payloadchunksize * payloadssent, payloadchunksize * ++payloadssent));
				if (payloadssent === payloadchunks) {
					clearInterval(payloadinterval);
					res.end();
				}
			},
			payloaddelay
		);
	}
);

app.listen(3000, () => console.log('server listening on port 3000'));