'use strict';
const zmq = require('zmq');
const requester = zmq.socket('req');
requester.connect('tcp://127.0.0.1:5433');
requester.on('message', function (data) {
	let response = JSON.parse(data);
	console.log('received response ', response);
});
for (let i = 0; i < 10; i++) {
	requester.send(JSON.stringify({
		reqNum: i
	}));
}