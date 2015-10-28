'use strict';

var app = require('koa')();
var Router = require('koa-router');
var logger = require('koa-logger');
var serve = require('koa-static');
var crawl = require('./crawlcover.js');
var conf = require('./config')(app.env);
var log = console.log
var api = new Router();
var server = null;
var io = null;

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
	require('./mplayer')(socket);
	//require('./auth').listen(socket);
});
