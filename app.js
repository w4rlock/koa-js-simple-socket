'use strict';

var app = require('koa')();
var Router = require('koa-router');
var logger = require('koa-logger');
var serve = require('koa-static');
var ss = require('socket.io-stream');
var path = require('path');
var crawl = require('./crawlcover.js');
var nutil = require('./nutil.js');
var conf = require('./config')(app.env);
var fs = require('fs');
var log = console.log
var api = new Router();
var server = null;
var io = null;
var mplayer = null;

api.get('/test', function*(){
	this.type = 'application/json';
	this.body = 'testttt';
	
});

api.get('/download', function*(){
	crawl.getAllCovers('w.a.s.p. the last command', (err, res) => {
		if (err) log(err);
		log(res);
	
	});
});


app.use(serve(__dirname + '/public'));
app.use(logger());
app.use(api.routes())
app.use(api.allowedMethods());

server = app.listen(conf.APP.PORT, () => log(`Server listing:${conf.APP.PORT}`));
io = require('socket.io')(server);

io.on('connection', socket => {
	mplayer = require('./mplayer')(socket);
	//require('./auth').listen(socket);

	ss(socket).on('upload', nutil.upload);

});
