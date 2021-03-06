'use strict';

const app = require('koa')();
let Router = require('koa-router');
let logger = require('koa-logger');
let serve = require('koa-static');
let ss = require('socket.io-stream');
let path = require('path');
let crawl = require('./crawlcover.js');
let nutil = require('./nutil.js');
let conf = require('./config')(app.env);
let cache = require("redis");
let cocache = require("co-redis");
let log = console.log
let api = new Router();
let server = null;
let io = null;
let	redis  = cache.createClient();
let	coredis = cocache(redis);
let mplayer = require('./mplayer')(coredis);

api.get('/test', function*(){
	this.type = 'application/json';
	this.body = 'testttt';
	
});

app.use(serve(__dirname + '/public'));
app.use(logger());
app.use(api.routes())
app.use(api.allowedMethods());


server = app.listen(conf.APP.PORT);
io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log(`New client connected ${socket.request.socket.remoteAddress}`);

  //broadcast function
  socket.allEmit = io.sockets.emit;
  socket.emitStream = ss(socket).emit; 

  mplayer.listen(socket);

  ss(socket).on('upload', mplayer.upload);

});
