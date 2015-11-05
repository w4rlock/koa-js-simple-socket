'use strict';

const TMP_DIR = '/tmp/';
const MUSIC_DIR = '/server/media/music/';

let fs = require('fs');
let spawn = require('child_process').spawn;
let exec = require('child_process').exec;
let path = require('path');
let log = console.log;
let Util = module.exports = exports = {}

let pkg = {
	'.zip':'unzip',
	'.rar':'unrar',
	 '.7z':'7z'
}



Util.upload = (stream, data) => {
	return new Promise((res, rej) => {
		let filename = TMP_DIR + path.basename(data.name);
		stream.pipe(fs.createWriteStream(filename));

		stream.on('end', () => {
			log('finish upload ', filename);

			Util.extractpkg(filename).then(
				(f) => exec('mpc update && (mpc ls | mpc add)', (e, stdo, stde) => { res(filename); }),
				(e) => { log(e); rej(e); }
			);

		});

	});
}



Util.download = (url, out) => {
	return new Promise((res, rej) => {
		log('wget downloading %s::%s ',url, out);

		spawn('wget', [url, '-O', out]).on('exit', status => {
			log('wget download status', status);

			if (status == 0){
				log('wget download done:: ', out);
				res(out);
				return;
			}
			else{
				rej('error downloading');
			}

		});

	});
}



Util.extractpkg = (file) => {
	return new Promise((res, rej) => {

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

				 default:
					let _er = 'Shit no extension support ' + file;
					log(_er);
					err(_er);
					return;
			}

			log(cmd, args);
			spawn(cmd, args).on('exit', (code) => {
				log(file, code);

				if (code == 0)
					res(file);
				else
					rej('error unzip');
			});

	});
}



Util.escapeShell = (cmd) => cmd.replace(/(["\s'\[\]\)\($`\\])/g,'\\$1');
