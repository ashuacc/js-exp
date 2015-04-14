'use strict';
const cluster = require('cluster');
const zmq = require('zmq');

if (cluster.isMaster) {
	let router = zmq.socket('router').bind('tcp://127.0.0.1:5433');
	let dealer = zmq.socket('dealer').bind('ipc://filer-dealer.ipc');

	router.on('message', function () {
		let frames = Array.prototype.slice.call(arguments);
		dealer.send(frames);
	});
	dealer.on('message', function () {
		let frames = Array.prototype.slice.call(arguments);
		router.send(frames);
	});

	cluster.on('online', function (worker) {
		console.log('Worker %d is online', worker.process.pid);
	});

	for (let i = 0; i < 3; i++) {
		cluster.fork();
	}
} else {

	let responder = zmq.socket('rep').connect('ipc://filer-dealer.ipc');
	responder.on('message', function(data) {
		console.log('received request ' + data);
		responser.send(JSON.stringify({
			processId: process.pid			
		}));
	});

}