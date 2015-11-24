'use strict';

const PLAYER = 'mpc';
const AMIXER = 'amixer';
const MDIR = '/server/media/music/';

let spawn = require('child_process').spawn;
let exec = require('child_process').exec;
let crawl = require('./crawlcover.js');
let nutil = require('./nutil')
let path = require('path');
let fs = require('fs');
let log = console.log;
let _timerNowPlaying = null;
let _currentPlay = null;
let _socket = null;
let Playlists = {};
let MPlayer = {};
let Volumen = {};
let cover404 = new Map();

let _listeners = {
	volumen: Volumen,
	player: MPlayer,
	playlist: Playlists
}


MPlayer.stop = () => run('stop');
MPlayer.next = () => run('next');
MPlayer.pause = () => run('pause');
MPlayer.nowplaying = nowplaying;
MPlayer.play = play;
MPlayer.cover404 = () => {
	console.log(cover404);
	
	let res = [];
	cover404.forEach((k, v) => res.push(k));

	_socket.emit('cover404', res);
};

// +5, -5, 60 in perc 60
Volumen.set = (perc) => run(['volume', perc]);
Volumen.mute = () => spawn(AMIXER, ['set', 'Master', 'toggle']);

Playlists.current = playlist_get;
Playlists.albumcover = sendCover;



/*
 * socket - listening mplayer methods.
 *
 */
module.exports = exports = {

	upload: (stream, data) => {
		nutil.upload(stream, data)
		.then(playlist_get);
	},

	listen: (socket) => {
		_socket = socket;

		if (_timerNowPlaying == null)
			_timerNowPlaying = setInterval(nowplaying, 2200);

		if (_currentPlay){
			sendCover(_currentPlay);
		}

		for (let obj in _listeners){
			for (let method in _listeners[obj]) {
				let skey = obj +':'+ method;

				socket.on(skey, _listeners[obj][method]);
				log(skey);

			}
	}
}
}



function run(flags){
	let args = Array.isArray(flags) ? flags : [flags];

	log(PLAYER, args);
	spawn(PLAYER, args);
}



function runWithCallback(cmd, args){
	 return new Promise((res, err) => {
		 let sp = spawn(cmd, args);

		 sp.stdout.on('data', (raw) => {
			 res(raw.toString());
		 });

	 });

}



function execWithCallback(cmd, args){
	 return new Promise((res, err) => {
		 exec(cmd, (err, stout, sterr) => {
			 res(stout);
		 });
	});
}



function play(index){
	if (!index){
		run('toggle');
	}
	else{
		run(['play', parseInt(index)+1]);
	}

}



function nowplaying(){
	 let mask = '%artist%:$:%album%:$:%title%';
	 mask+= ':$:%genre%:$:%date%:$:%time%';
	 mask+= ':$:%position%:$:%file%'

	 runWithCallback(PLAYER, [ '-f', mask ]).then((raw) => {
		 let rdata = raw.split('\n');
		 let data = rdata[0].split(':$:');


		 let stimes = rdata[1].split(' ');
		 let ptime = stimes[4].split('/')[0];
		 let pperc = stimes[5].match(/\d+/g)[0];

		 let _status = stimes[0].match(/\w+/g)[0];
		 let vol = rdata[2].split('  ')[0].match(/\d+/g)[0];

		 let _current = {
				 artist: data[0],
					album: data[1],
					title: data[2],
					genre: data[3],
					 date: data[4],
			 duration: data[5],
			 position: parseInt(data[6]-1),
					 file: data[7],
				 status: _status,
						vol: vol,
		   progress: { time: ptime, perc: pperc }

		 };

		 if (_currentPlay == null || _currentPlay.album != _current.album){
			 _currentPlay = _current;
			 sendCover(_current);
		 }

		_socket.allEmit('player:nowplaying', _current);

	 });
}


function sendCover(_current){
	 getCovers(_current).then((res) => {

			 fs.readFile(res[0], (err, buf) => {
				 if (!buf){
         	if (_current.fromPlaylist){
						cover404.set(_current.id, _current);
					}	
					return;
				 }

				 log('Sending stream cover ', res[0]);
				 if (_current.fromPlaylist){
					 _socket.emit('cover', { buffer: buf.toString('base64'), id: _current.id });
				 }
				 else{
					 _socket.allEmit('cover', { buffer: buf.toString('base64') });
				 }

			 });
		 },
		 (err) => log(err));
}



function getCovers(_song){
	 return new Promise((res, err) => {

		 let dir = MDIR + path.dirname(_song.file) + '/';
		 let file = dir + 'front_thumb.png';

				res([file]);
				return;


		 log('Searching covers ', dir);
		 if (!fs.existsSync(file) && !_song.fromPlaylist){
			 let s = `${_song.artist} ${_song.album}`;

			 /*
				* remove posible extra texts [Remaster] ..etc
				*/
			 s = s.replace(/ *\[[^)]*\] */g, " ");
			 s = s.replace(/ *\([^)]*\) */g, " ");

			 log('Downloading covers ', s);

			 crawl.getFrontBack(s, dir)
			  .then(nutil.thumbnails)
				.then(res, err);

			}
			else{
				res([file]);
			}

	});
}



function play(index){
	if (!index)
		run('toggle');
	else
		run(['play', parseInt(index) + 1]);
}



function playlist_get(){
	 let mask = '%artist%:$:%album%:$:%title%:$:%date%:$:%time%:$:%file%';

	 execWithCallback(`${PLAYER} playlist -f ${mask}`).then((raw) => {
		 let res = raw.split('\n');
		 log(res.length);

		 if (res){
			 res.pop();
			 res = res.map((dat) => {
				 let data = dat.split(':$:');

				 return {
					 artist: data[0],
						album: data[1],
						title: data[2],
						 year: data[3].substr(0,4),
				 duration: data[4],
						 file: data[5]
				 };
			 
			 });
		 }

		 log(res.length);
		 _socket.emit('playlist:current', res);
	 });
}

