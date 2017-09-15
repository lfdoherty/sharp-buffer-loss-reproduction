const sharp = require('sharp')
const fs = require('fs')

const readAllFilesInTar = require('./read_all_files_in_tar')

let okCount = 0;

console.log('Note: this may take 30 seconds or so to complete.')

const rs = readAllFilesInTar('s_covers_0000_00.tar', (entry, doneCb) => {
	const buffers = []
	entry.on('data', data => {
		buffers.push(data)
	})
	entry.on('end', () => {
		const buf = Buffer.concat(buffers);
		const buf2 = Buffer.from(buf);
		sharp(buf2)
			.raw()
			.toBuffer((err, data, info) => {
				if(err){
					//if(buf2[0] !== buf2[1]){}//DELETE/COMMENT this line to trigger error
					throw err;
				}
				++okCount;
				doneCb()
			})
	})
}, () => {
	console.log('finished ' + okCount + ' jpeg files from the tar file without error.')
	console.log('comment out/delete line 22 of repro.js to trigger bug')
})
