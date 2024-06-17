class Track {
	constructor() {
		this._urlModel = require('../model/UrlModel');
		this._verifier = require('../feature/Verifier.js');
		this._regex = require('../util/Regex.js');
		this._schedule = require('node-schedule');
		this._urlModel.read();
	}
	
	/**
	 * Schedule verification in a specific time.
	 * Default: Every 30 minutes
	 */
	scheduleVerification(callback, time = '* * * * *') {
		this._schedule.scheduleJob(time, async () => {
			console.log("Verifying track list...");
			const data = await this._urlModel.read()
			data.forEach(item => {
				const msgId = item.msgId
				const url = item.url
				
				// emulate a msg obj
				let msg = {};
				msg.chat = {};
				msg.chat.id = msgId;
				
				this._verifier.verifyUrl(
					msg,
					this._regex.urlRegex.exec(url),
					(msg, url, success, statusCode) => {
						if (!success) {
							callback(url, msgId, success);
							// this.setUrl(url, msgId, success, itemKey);
						}
					});
				
			});
		});
	}
	
	/**
	 * Add Url to track
	 */
	async addUrl(url, msgId, currentStatus) {
		await this._urlModel.append({
			url,
			currentStatus,
			msgId
		})
	}
	
	/**
	 * Set an url item
	 */
	setUrl(url, msgId, currentStatus, itemId) {
		// let ref = this._firebase.database().ref(`track/${msgId}/${itemId}`);
		// let urlTrack = new this._urlTrack(url, currentStatus);
		//
		// ref.update(urlTrack);
	}
	
	
	/**
	 * Get all tracked urls
	 */
	async getAllFromUser(msgId, callback, justUrls = true) {
		const data = await this._urlModel.read()
		let urlList = [];
		data.forEach(item => {
			urlList.push(item.url);
		});
		callback(msgId, urlList);
	}
	
	/**
	 * Generate a keyboard with all tracked urls
	 */
	getAllUrlsKeyBoard(msgId, callback) {
		this.getAllFromUser(msgId, (msgId, urls) => {
			const urlOpts = [];
			
			for (let index in urls) {
				let url = urls[index]
				urlOpts.push([{
					text: url,
					callback_data: url
				}]);
			}
			
			if (urlOpts.length === 0) {
				callback(null);
				return;
			}
			const keyboard = {
				reply_markup: {
					inline_keyboard: urlOpts
				}
			};
			
			callback(keyboard)
		}, false);
	}
	
	// delete an url
	async deleteUrl(msgId, itemId, callback) {
		await this._urlModel.destroy(msgId, itemId)
		callback(true, msgId);
	}
}

module.exports = Track;
