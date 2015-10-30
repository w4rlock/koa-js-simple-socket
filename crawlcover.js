'use strict';


const	HOST = 'http://www.coverlib.com';
var log = console.log
	, utils = require('./nutil')
	, request = require('request')
	, cheerio = require('cheerio')
  , temp = require('temp')
	, Crawl = module.exports = exports = {};


Crawl.getAllCovers = (artcover, cb) => {
	let url = getUrlSearch(artcover);
	get(url, '.thumbnail h4 a', 'href', (links) => {

		if (!links || links.length < 1){
			cb('Cover not found', null);
			return;
		}

		let zip = HOST+links[0]+'/zip';
		log(zip);

		let dir = temp.mkdirSync('covers_')+'/covers.zip';
		utils.download(zip, dir, (err, file) => {
			if (err){
				cb(err, null);
				return;
			}

			utils.extractpkg(file, cb);

		});

	});

	log(url);
}


function getUrlSearch(artcover) {
	artcover = artcover.replace(/\s+/g,'+');
	return `${HOST}/search/?q=${artcover}&Sektion=`;
}


function get(url, filter, attr, callback){
	request({ uri: url}, (err, resp, body) => {

		let $ = cheerio.load(body);
		let res = [];

		$(filter).each( (i, html) => {
			res.push($(html).attr(attr));
		});

		callback(res);

	});
}


