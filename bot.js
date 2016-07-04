'use strict'

const Bot = require('messenger-bot')

let bot = new Bot({
  token: process.env.FB_PAGE_ACCESS_TOKEN,
  verify: process.env.FB_PAGE_VERIFY_TOKEN,
  //app_secret: 'APP_SECRET'
})

bot.on('error', (err) => {
  console.log(err.message)
})

bot.on('message', (payload, reply) => {
  let text = payload.message.text

  	if (text === 'Generic') {
  		let messageData = {
            "template_type": "generic",
            "elements": [{
                "title": "First card",
                "subtitle": "Element #1 of an hscroll",
                "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
                "buttons": [{
                    "type": "web_url",
                    "url": "https://www.messenger.com",
                    "title": "web url"
                }, {
                    "type": "postback",
                    "title": "Postback",
                    "payload": "Payload for first element in a generic bubble",
                }],
            }, {
                "title": "Second card",
                "subtitle": "Element #2 of an hscroll",
                "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                "buttons": [{
                    "type": "postback",
                    "title": "Postback",
                    "payload": "Payload for second element in a generic bubble",
                }],
            }]
        };

        reply({
		    attachment: {
		        type: 'template',
		        payload: messageData
		    }
	    }, (err) => {
		  	if (err) {
				console.log(err);
				return;
			}

		  	console.log(`Echoed back to ${payload.sender.id}: ${text}`)
		})

		return;
	}

	bot.getProfile(payload.sender.id, (err, profile) => {
		if (err) {
			console.log(err);
			return;
		}

		reply({ text }, (err) => {
		  	if (err) {
				console.log(err);
				return;
			}

		  	console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`)
		})
	})
})

module.exports = bot