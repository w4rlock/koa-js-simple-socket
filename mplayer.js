'use strict';

const PLAYER = 'mpc';
const AMIXER = 'amixer';
const MDIR = '/server/media/music/';

let spawn = require('child_process').spawn;
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

// +5, -5, 60 in perc 60
Volumen.set = (perc) => run(['volume', perc]);
Volumen.mute = () => spawn(AMIXER, ['set', 'Master', 'toggle']);

Playlists.current = () => playlist_get();



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

	 runWithCallback(PLAYER, [ 'current','-f', mask ]).then((raw) => {
		 let data = raw.split(':$:');

		 let _current = {
				 artist: data[0],
					album: data[1],
					title: data[2],
					genre: data[3],
					 date: data[4],
					 time: data[5],
			 position: parseInt(data[6]-1),
					 file: data[7],
		 };

		 if (_currentPlay == null || _currentPlay.album != _current.album){
			 _currentPlay = _current;
			 sendCover(_current);
		 }

		log(JSON.stringify(_currentPlay));
		_socket.allEmit('player:nowplaying', _current);

	 });
}


function sendCover(_current){
	 getCovers(_current).then((res) => {
			log('Sending stream cover ', res[0]);

			 fs.readFile(res[0], (err, buf) => {
				 _socket.allEmit('cover', { buffer: buf.toString('base64') });
			 });
		 },
		 (err) => log(err));
}


function getCovers(_song){
	 return new Promise((res, err) => {
		 let dir = MDIR + path.dirname(_song.file) + '/';
		 let file = dir + 'front.png';

		 log('Searching covers ', dir);
		 if (!fs.existsSync(file)){
			 let s = `${_song.artist} ${_song.album}`;
			 log('Downloading covers ', s);

			 crawl.getFrontBack(s, dir).then(res, err);
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
	 let mask = '%artist%:$:%album%:$:%title%:$:%date%:$:%time%';

	 runWithCallback(PLAYER, [ 'playlist', '-f', mask ]).then((raw) => {
		 let res = raw.split('\n');

		 if (res){
			 res.pop();
			 res = res.map((dat) => {
				 let data = dat.split(':$:');

				 return {
					 artist: data[0],
						album: data[1],
						title: data[2],
						 date: data[3],
						 time: data[4]
				 };
			 
			 });
		 }

		 _socket.emit('playlist:current', res);
	 });
}

