'use strict';

const app = require('koa')();
let Router = require('koa-router');
let logger = require('koa-logger');
let serve = require('koa-static');
let ss = require('socket.io-stream');
let path = require('path');
let crawl = require('./crawlcover.js');
let nutil = require('./nutil.js');
let mplayer = require('./mplayer');
let conf = require('./config')(app.env);
let fs = require('fs');
let log = console.log
let api = new Router();
let server = null;
let io = null;

api.get('/test', function*(){
	this.type = 'application/json';
	this.body = 'testttt';
	
});

api.get('/download', function*(){
	//crawl.getAllCovers('w.a.s.p. the last command', (err, res) => {
		//if (err) log(err);
		//log(res);
	//});
});


app.use(serve(__dirname + '/public'));
app.use(logger());
app.use(api.routes())
app.use(api.allowedMethods());

server = app.listen(conf.APP.PORT);
io = require('socket.io')(server);

io.on('connection', (socket) => {
	//broadcast function
	socket.allEmit = io.sockets.emit;
	socket.emitStream = ss(socket).emit; 

	mplayer.listen(socket);
	//require('./auth').listen(socket);

	ss(socket).on('upload', mplayer.upload);

});
