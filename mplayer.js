'use strict';

const PLAYER = 'mpc';
const AMIXER = 'amixer';

var spawn = require('child_process').spawn;
var MPlayer = {};
var Volumen = {};
var Playlists = {};
var _socket = {};
var _currentPlay = null;

var _listeners = {
	volumen: Volumen,
	player: MPlayer,
	playlist: Playlists
}


MPlayer.stop = () => run('stop');
MPlayer.next = () => run('next');
MPlayer.pause = () => run('pause');
MPlayer.nowplaying = () => nowplaying();
MPlayer.play = (index) => play(index);

Volumen.set = (args) => vol_set(args);
Volumen.mute = () => vol_mute();

Playlists.current = () => playlist_get();



/*
 * socket - listening mplayer methods.
 *
 */
module.exports = exports = socket => {
	_socket = socket;

	for (let obj in _listeners){
		for (let method in _listeners[obj]) {

			let skey = obj +':'+ method;

			socket.on(skey, _listeners[obj][method]);
			console.log(skey);

		}
	}
}



function run(flags){
	let args = Array.isArray(flags) ? flags : [flags];

	console.log('------');
	console.log(flags);

	spawn(PLAYER, args);
}



function runWithCallback(cmd, args, cb){
	 let sp = spawn(cmd, args);

	 sp.stdout.on('data', (raw) => {
		 cb(raw.toString());
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
	 let mask = '%artist%:$:%album%:$:%title%:$:%genre%:$:%date%:$:%time%';

	 runWithCallback(PLAYER, [ 'current','-f', mask ], (raw) => {
		 let data = raw.split(':$:');

		 let _current = {
			 artist: data[0],
				album: data[1],
				title: data[2],
				genre: data[3],
				 date: data[4],
				 time: data[5]
		 };

		 _socket.emit('player:nowplaying', _current);

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



/*
 * +5
 * -5
 *  60 in perc 60
 */
function vol_set(perc){
	run(['volume', perc]);

}



function vol_mute(){
	spawn(AMIXER, ['set', 'Master', 'toggle']);
}



function playlist_get(){
	 runWithCallback(PLAYER, [ 'playlist' ], (raw) => {
		 let res = raw.split('\n');
		 if (res) res.pop();

		 _socket.emit('playlist:current', res);
	 });
}

