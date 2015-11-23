'use strict';

const TMP_DIR = '/tmp/';
const MUSIC_DIR = '/home/ensiferum/Music/';

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
				(f) => exec('mpc update && mpc clear && (mpc ls | mpc add)', (e, stdo, stde) => { res(filename); }),
				(e) => { log(e); rej(e); }
			);

		});

	});
}



Util.thumbnails = (imgs) => {
	log('Convert thumbnails ', JSON.stringify(imgs));

	return new Promise((res, rej) => {
		Promise.all(imgs.map(Util.thumbnail)).then(res, rej);
	});
}


Util.thumbnail = (img) => {
	return new Promise((res, rej) => {
		log('Convert thumbnail ', img);
		let ext = path.extname(img);
		let thumb = img.replace(ext, '_thumb'+ext);

		let args = [];
		args.push(img);
		args.push('-thumbnail');
		args.push('300x280');
		args.push(thumb);

		spawn('convert', args).on('exit', status => {
			if (status != 0)
				rej('error convert thumbnail img '+img);
			else
				res(thumb);
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
			//file = Util.escapeShell(file);
			let ext = path.extname(file);
			let cmd = pkg[ext];
			let args = [];

			if (!cmd) return;

			switch(ext){
				case '.zip': 
					args.push('-o');
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


			let proc = spawn(cmd, args);
			proc.stdout.on('data', (data) => {
				log('stdout: ' + data);
			});

			proc.stderr.on('data', (data) => {
				log('stderr: ' + data);
			});

			proc.on('close', (code) => {
				log('child process exited with code ' + code);

				if (code == 0)
					res(file);
				else
					rej('error unzip');

			});

	});
}



Util.escapeShell = (cmd) => cmd.replace(/(["\s'\[\]\)\($`\\])/g,'\\$1');
