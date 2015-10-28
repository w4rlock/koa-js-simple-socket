'use strict';

var spawn = require('child_process').spawn
var Utils = module.exports = exports = {}
	, log = console.log;


Utils.download = (url, out, callback) => {
	log('wget downloading:: ',url);

	spawn('wget', [url, '-O', out]).on('exit', status => {
		log('wget download status', status);

		if (status == 0){
			log('wget download done:: ', out);
			callback(null, out);
			return;
		}

		callback('error downloading zip', null);

	});
}


Utils.unzip = (zipfile, callback) => {
	log('unzip file:: ', zipfile);

	spawn('unzip', [zipfile]).on('exit', status => {
		log('unzip status', status);

		if (status == 0){
			callback(null, zipfile);
			return;
		}

		callback('error unzip', null);

	});
}
