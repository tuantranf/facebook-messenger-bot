'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

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
    	bot.sendMessage(payload.sender.id, messageData, (err, profile) => {
			if (err) throw err

			reply({ text }, (err) => {
			  	if (err) throw err

			  	console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`)
			});
		});
    	return;
	}

	bot.getProfile(payload.sender.id, (err, profile) => {
		if (err) throw err

		reply({ text }, (err) => {
		  if (err) throw err

		  console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`)
		})
	})
})

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    return bot._verify(req, res)
})

app.post('/webhook/', function (req, res) {
	bot._handleMessage(req.body)
  	res.end(JSON.stringify({status: 'ok'}))
})

// app.post('/webhook/', function (req, res) {
//     let messaging_events = req.body.entry[0].messaging
//     for (let i = 0; i < messaging_events.length; i++) {
//       let event = req.body.entry[0].messaging[i]
//       let sender = event.sender.id
//       if (event.message && event.message.text) {
//         let text = event.message.text
//         if (text === 'Generic') {
//             sendGenericMessage(sender)
//             continue
//         }
//         sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
//       }
//       if (event.postback) {
//         let text = JSON.stringify(event.postback)
//         sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
//         continue
//       }
//     }
//     res.sendStatus(200)
// })

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

// function sendTextMessage(sender, text) {
//     let messageData = { text:text }
//     request({
//         url: 'https://graph.facebook.com/v2.6/me/messages',
//         qs: {access_token:token},
//         method: 'POST',
//         json: {
//             recipient: {id:sender},
//             message: messageData,
//         }
//     }, function(error, response, body) {
//         if (error) {
//             console.log('Error sending messages: ', error)
//         } else if (response.body.error) {
//             console.log('Error: ', response.body.error)
//         }
//     })
// }

// function sendGenericMessage(sender) {
//     let messageData = {
//         "attachment": {
//             "type": "template",
//             "payload": {
//                 "template_type": "generic",
//                 "elements": [{
//                     "title": "First card",
//                     "subtitle": "Element #1 of an hscroll",
//                     "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
//                     "buttons": [{
//                         "type": "web_url",
//                         "url": "https://www.messenger.com",
//                         "title": "web url"
//                     }, {
//                         "type": "postback",
//                         "title": "Postback",
//                         "payload": "Payload for first element in a generic bubble",
//                     }],
//                 }, {
//                     "title": "Second card",
//                     "subtitle": "Element #2 of an hscroll",
//                     "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
//                     "buttons": [{
//                         "type": "postback",
//                         "title": "Postback",
//                         "payload": "Payload for second element in a generic bubble",
//                     }],
//                 }]
//             }
//         }
//     }
//     request({
//         url: 'https://graph.facebook.com/v2.6/me/messages',
//         qs: {access_token:token},
//         method: 'POST',
//         json: {
//             recipient: {id:sender},
//             message: messageData,
//         }
//     }, function(error, response, body) {
//         if (error) {
//             console.log('Error sending messages: ', error)
//         } else if (response.body.error) {
//             console.log('Error: ', response.body.error)
//         }
//     })
// }
