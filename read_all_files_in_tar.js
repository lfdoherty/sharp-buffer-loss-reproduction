'use strict'
const tar = require('tar')
const path = require('path')
const fs = require('fs')

module.exports = function(path, fileHandler, doneCb){
	let remaining = 1
	function cdl(){
		--remaining;
		if(remaining === 0){
			doneCb()
		}else if(remaining < 0){
			throw new Error('TODO')
		}
	}

	const parser = new tar.Parse()
	parser.on('entry', entry => {
		++remaining;
		fileHandler(entry, cdl)
		entry.resume()
	})
	parser.on('end', () => {
		cdl()
	})
	fs.createReadStream(path).pipe(parser)
}