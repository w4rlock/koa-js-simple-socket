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
	get(url, '.thumbnail h4 a', 'href', (err, links) => {

		if (err) return;

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



Crawl.getFrontBack = (search, dir, cb) => {
	let url = getUrlSearch(search);

	get(url, '.thumbnail h4 a', 'href', (err, links) => {
		if (err){ cb(err, null); return; }

		get(HOST+links[0], '.gallerytwo-item', 'href', (err, lnk) => {
			if (err){ cb(err, null); return; }

			utils.download(lnk[0], dir+'front.png', (err,out) => {
				if (err){ cb(err, null); return;}

				utils.download(lnk[1], dir+'back.png', (err, out) => {
					if (err){ cb(err, null); return;}

					cb(null, dir);
				});

			});
		});
	});
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

		if (!res || res.length < 1){
			callback('resource not found', null);
		}
		else{
			callback(null, res);
		}

	});
}


