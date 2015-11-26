'use strict';

let log = console.log
	, utils = require('./nutil')
	, request = require('request')
	, cheerio = require('cheerio')
	, Crawl = module.exports = exports = {};

const site = {
		host: 'http://www.covermytunes.com/',
		html: { elem: '.ProductImage img', attr: 'src'},
		 url: q => this.host + 'search.php?search_query='+ q.replace(/\s+/g,'+') 
}


Crawl.getFront = (search, dir) => {
	return new Promise((res, err) => {

		get(site, search).then(arg => {

				let url = arg[0].replace(/\d{3}x\d{3}/g, '800x800');
				utils.download(url, dir).then(res)
		
		});

	});

}
	 


function get(site, search){
	return new Promise((res, rej) => {

		let url = site.url(search);
		log('Scrawling site: ', url);

		request({ uri: url }, (err, resp, body) => {
			let $ = cheerio.load(body);
			let dat = [];

			$(site.html.elem).each((i, html) => dat.push($(html).attr(site.html.attr)));

			if (!dat || dat.length < 1)
				rej('resource not found');
			else
				res(dat);

		});

	});

}
