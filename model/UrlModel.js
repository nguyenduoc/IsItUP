const fs = require('fs')
const path = "data.txt";

class UrlModel {
	async read() {
		return new Promise((resolve, reject) => {
			try {
				fs.readFile(path, 'utf8', (err, data) => {
					if (err) {
						console.error(err);
						return;
					}
					resolve(JSON.parse(data));
				});
			} catch (e) {
				console.log(e)
				reject(e);
			}
		})
	}
	
	async write(data) {
		fs.writeFile(path, JSON.stringify(data), err => {
			if (err) {
				console.error(err);
			} else {
				// file written successfully
			}
		});
	}
	
	async append(url) {
		let data = await this.read();
		if (!data) {
			data = []
		}
		data.push(url);
		await this.write(data);
	}
	
	async set(url) {
		let data = await this.read();
		if (!data) {
			data = []
		}
		data.push(url);
		await this.write(data);
	}
	
	async destroy(msgId, url) {
		let data = await this.read();
		if (!data) {
			data = []
		}
		data = data.filter((item) => item.url !== url);
		await this.write(data);
	}
}

module.exports = new UrlModel();