'use strict';


const	HOST = 'http://www.coverlib.com';
var log = console.log
	, utils = require('./nutil')
	, request = require('request')
	, cheerio = require('cheerio')
  , temp = require('temp')
	, Crawl = module.exports = exports = {};


Crawl.getAllCovers = (artcover) => {
	return new Promise((res, err) => {

		let url = getUrlSearch(artcover);

		get(url, '.thumbnail h4 a', 'href')
		.then((links) => {

				let zip = HOST+links[0]+'/zip';
				log(zip);

				let dir = temp.mkdirSync('covers_')+'/covers.zip';
				utils.download(zip, dir).then(
					(file) => utils.extractpkg(file),
					(error) => err(error)
				);

		});

		log(url);

	});
}



Crawl.getFrontBack = (search, dir) => {
	return new Promise((res, err) => {
		let url = getUrlSearch(search);

		get(url, '.thumbnail h4 a', 'href')
		.then((links) => get(HOST+links[0], '.gallerytwo-item', 'href'))
		.then((links) => {

			/** Parallel async */
			Promise.all([ 
					utils.download(links[0], dir+'front.png'),
					utils.download(links[1], dir+'back.png')
			])
			.then(res)

		})
		.catch(err);

	});

}



function getUrlSearch(artcover) {
	artcover = artcover.replace(/\s+/g,'+');
	return `${HOST}/search/?q=${artcover}&Sektion=`;
}



function get(url, filter, attr){
	return new Promise((res, rej) => {
		log('downloading ', url);

		request({ uri: url}, (err, resp, body) => {
			let $ = cheerio.load(body);
			let dat = [];

			$(filter).each((i, html) => {
				dat.push($(html).attr(attr));
			});

			if (!dat || dat.length < 1)
				rej('resource not found');
			else
				res(dat);

		});

	});
}


