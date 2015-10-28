'use strict';

var spawn = require('child_process').spawn;

var MPlayer = {}

MPlayer.stop = () => run('stop');
MPlayer.play = () => run('play');
MPlayer.next = () => run('next');
MPlayer.pause = () => run('pause');
MPlayer.mute = () => run('mute');
MPlayer.nowplaying = () => run('nowplaying');

MPlayer['vol:up'] = () => run('vol_up');
MPlayer['vol:down'] = () => run('vol_down');



function run(action){
	console.log('------');
	console.log(action);
	spawn('mpc', [action]);
}



/*
 * socket - listening mplayer methods.
 *
 */
module.exports = exports = socket => {
	for (let k in MPlayer) {
		let method = 'player:'+k;

		socket.on(method, MPlayer[k]);
		console.log(method);

	});
}
