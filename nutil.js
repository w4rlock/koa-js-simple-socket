'use strict';

const TMP_DIR = '/tmp/';
const MUSIC_DIR = '/server/media/music/';

let fs = require('fs');
let spawn = require('child_process').spawn;
let path = require('path');
let log = console.log;
let Util = module.exports = exports = {}

let pkg = {
	'.zip':'unzip',
	'.rar':'unrar',
	 '.7z':'7z'
}



Util.upload = (stream, data) => {
	let filename = TMP_DIR + path.basename(data.name);
	stream.pipe(fs.createWriteStream(filename));

	stream.on('end', () => {
		log('finish upload ', filename);

		Util.extractpkg(filename, () => {});

	});
}



Util.download = (url, out, cb) => {
	log('wget downloading:: ',url);

	spawn('wget', [url, '-O', out]).on('exit', status => {
		log('wget download status', status);

		if (status == 0){
			log('wget download done:: ', out);
			cb(null, out);
			return;
		}

		cb('error downloading zip', null);

	});
}



Util.extractpkg = (file, cb) => {
	let ext = path.extname(file);
	let cmd = pkg[ext];
	let args = [];

	if (!cmd) return;

	switch(ext){
		case '.zip': 
			args.push(file);
			args.push('-d');
			args.push(MUSIC_DIR);
			break;

		case '.rar':
			args.push('e');
			args.push(file);
			args.push(MUSIC_DIR);
			break;

		 case '.7z':
			args.push('x');
			args.push(file);
			break;
	}

	spawn(cmd, args).on('exit', status => {
		log('unzip status', status);

		if (status == 0){
			cb(null, zipfile);
			return;
		}

		cb('error unzip', null);

	});

}

