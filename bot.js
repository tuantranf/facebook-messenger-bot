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

let menulv1 = {
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
    }]
  }, {
    "title": "Second card",
    "subtitle": "Element #2 of an hscroll",
    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
    "buttons": [{
        "type": "postback",
        "title": "Postback",
        "payload": "Payload for second element in a generic bubble",
    }]
  }]
};

bot.on('message', (payload, reply) => {
  let text = payload.message.text
  let senderId = payload.sender.id

  console.log(`Received ${senderId}: ${text}`)

  if (text === 'Menu') {
    reply({
      attachment: {
        type: 'template',
        payload: menulv1
      }
    }, (err) => {
      if (err) return console.log(err)
      console.log(`Echoed back to ${senderId}: ${text}`)
    })
  } else {
    bot.getProfile(senderId, (err, profile) => {
      if (err) return console.log(err)

      reply({ text }, (err) => {
        if (err) return console.log(err)

        console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`)
      })
    })
  }
})

bot.on('postback', (payload, reply) => {
  console.log(`Received postback. payload ${payload}`)

  reply({
    text: 'hey!'
  }, (err, info) => {
    if (err) return console.log(err)

    console.log('postback')
  })
})


module.exports = bot