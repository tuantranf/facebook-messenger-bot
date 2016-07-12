'use strict'

const request = require('request')
const cheerio = require("cheerio")
const async = require("async")
const Bot = require('messenger-bot')

let bot = new Bot({
  token: process.env.FB_PAGE_ACCESS_TOKEN,
  verify: process.env.FB_PAGE_VERIFY_TOKEN,
  //app_secret: 'APP_SECRET'
})

let _todayZodiac = {};

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
        "title": "Button",
        "payload": "button",
    }, {
        "type": "postback",
        "title": "Video",
        "payload": "video",
    }]
  }, {
    "title": "Second card",
    "subtitle": "Element #2 of an hscroll",
    "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
    "buttons": [{
        "type": "postback",
        "title": "Audio",
        "payload": "audio",
    }, {
        "type": "postback",
        "title": "Recipe",
        "payload": "recipe",
    }, {
        "type": "postback",
        "title": "Quick",
        "payload": "quick",
    }]
  }, {
    "title": "Third card",
    "subtitle": "Element #3 of an hscroll",
    "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
    "buttons": [{
        "type": "postback",
        "title": "Image",
        "payload": "image",
    }]
  }]
}

let button = {
  "attachment":{
    "type":"template",
    "payload":{
      "template_type":"button",
      "text":"What do you want to do next?",
      "buttons":[
        {
          "type":"web_url",
          "url":"https://petersapparel.parseapp.com",
          "title":"Show Website"
        },
        {
          "type":"postback",
          "title":"Start Chatting",
          "payload":"USER_DEFINED_PAYLOAD"
        }
      ]
    }
  }
}

let video = {
  "attachment":{
    "type":"video",
    "payload":{
      "url":"https://petersapparel.com/bin/clip.mp4"
    }
  }
}

let image = {
  "attachment":{
    "type":"image",
    "payload":{
      "url":"http://s3.favim.com/orig/42/-animal-animals-cute-dog-Favim.com-361124.jpg"
    }
  }
}

let audio = {
  "attachment":{
    "type":"audio",
    "payload":{
      "url":"https://petersapparel.com/bin/clip.mp3"
    }
  }
}

let recipe = {
  "attachment":{
    "type":"template",
    "payload":{
      "template_type":"receipt",
      "recipient_name":"Stephane Crozatier",
      "order_number":"12345678902",
      "currency":"USD",
      "payment_method":"Visa 2345",
      "order_url":"http://petersapparel.parseapp.com/order?order_id=123456",
      "timestamp":"1428444852",
      "elements":[
        {
          "title":"Classic White T-Shirt",
          "subtitle":"100% Soft and Luxurious Cotton",
          "quantity":2,
          "price":50,
          "currency":"USD",
          "image_url":"http://petersapparel.parseapp.com/img/whiteshirt.png"
        },
        {
          "title":"Classic Gray T-Shirt",
          "subtitle":"100% Soft and Luxurious Cotton",
          "quantity":1,
          "price":25,
          "currency":"USD",
          "image_url":"http://petersapparel.parseapp.com/img/grayshirt.png"
        }
      ],
      "address":{
        "street_1":"1 Hacker Way",
        "street_2":"",
        "city":"Menlo Park",
        "postal_code":"94025",
        "state":"CA",
        "country":"US"
      },
      "summary":{
        "subtotal":75.00,
        "shipping_cost":4.95,
        "total_tax":6.19,
        "total_cost":56.14
      },
      "adjustments":[
        {
          "name":"New Customer Discount",
          "amount":20
        },
        {
          "name":"$10 Off Coupon",
          "amount":10
        }
      ]
    }
  }
}

let quickReliesMsg = {
  "text":"Pick a color:",
  "quick_replies":[
    {
      "content_type":"text",
      "title":"Red",
      "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
    },
    {
      "content_type":"text",
      "title":"Green",
      "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
    }
  ]
}

let zodiacs = {
  "template_type": "generic",
  "elements": [{
    "title": "Bach Duong",
    "subtitle": "Element #1 of an hscroll",
    "image_url": "http://ngaydep.com/templates/ngaydep/images/cung-bach-duong-thumb.jpg",
    "buttons": [{
      "type": "postback",
      "title": "Button",
      "payload": "button.zodiac.bach-duong",
    }]
  }, {
    "title": "Kim Nguu",
    "subtitle": "Element #1 of an hscroll",
    "image_url": "http://ngaydep.com/templates/ngaydep/images/cung-kim-nguu-thumb.jpg",
    "buttons": [{
        "type": "postback",
        "title": "Button",
        "payload": "button.zodiac.kim-nguu",
    }]
  }, {
    "title": "Song tu",
    "subtitle": "Element #1 of an hscroll",
    "image_url": "http://ngaydep.com/templates/ngaydep/images/cung-song-tu-thumb.jpg",
    "buttons": [{
        "type": "postback",
        "title": "Button",
        "payload": "button.zodiac.song-tu",
    }]
  }, {
    "title": "Xu nu",
    "subtitle": "Element #1 of an hscroll",
    "image_url": "http://ngaydep.com/templates/ngaydep/images/cung-xu-nu-thumb.jpg",
    "buttons": [{
        "type": "postback",
        "title": "Xu nu",
        "payload": "button.zodiac.xu-nu"
    }]
  }]
}

bot.on('message', (payload, reply) => {
  let text = payload.message.text
  let senderId = payload.sender.id

  console.log(`Received ${senderId}: ${text}`)

  if (text === 'Menu' || text === 'menu') {
    reply({
      attachment: {
        type: 'template',
        payload: menulv1
      }
    }, (err) => {
      if (err) return console.log("reply error" + err.message)
      console.log(`Echoed back to ${senderId}: ${text}`)
    })
  } else if(text==='Zodiac' || text==='zodiac' || text==='Tuvi' || text==='tuvi') {
    reply({
      attachment: {
        type: 'template',
        payload: zodiacs
      }
    }, (err) => {
      if (err) return console.log("reply error" + err.message)
      console.log(`Echoed back to ${senderId}: ${text}`)
    })
  } else {
    bot.getProfile(senderId, (err, profile) => {
      if (err) return console.log("get profile" + err.message)

      reply({ text }, (err) => {
        if (err) return console.log("reply error" + err.message)

        console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`)
      })
    })
  }
})

bot.on('postback', (payload, reply) => {
  console.log(`Received postback. payload ${JSON.stringify(payload)}`)

  let senderId = payload.sender.id
  let text = payload.postback.payload

  let message = {}

  let isZodiac = /^button.zodiac.*/.test(text);
  if (isZodiac) {
    let match = text.match(/^button.zodiac.(.*)/)
    let zodiac = match[1] || "cu-giai";

    getTodayZodiac(zodiac, function(err, result) {
      if (err) return console.log("get profile" + err.message)

      // console.log('detail:', result);

      // split result to array
      result = result.match(/.{1,320}/g);

      let series = [];

      for (var i = 0; i < result.length - 1; i++) {
        series.push(function(done) {
          message = { text: `${result[i]}` };
          reply(message, (err, info) => {
            if (err) return done(err)
            done(null);
          })
        })
      }

      async.series(series, function(err) {
        if (err) return console.log("send message error:" + err.message)

        console.log(`postback payload: ${text}`)
        return;
      });
    });
  } else {
    switch(text) {
      case 'button':
        message = button
        break;
      case 'video':
        message = video
        break;
      case 'image':
        message = image
        break;
      case 'audio':
        message = audio
        break;
      case 'recipe':
        message = recipe
        break;
      case 'quick':
        message = quickReliesMsg
        break;
      default:
        message = { text: 'hey!' }
        break;
    }

    reply(message, (err, info) => {
      if (err) return console.log("reply error" + err.message)

      console.log(`postback payload: ${text}`)
    })
  }
})

function getTodayZodiac(zodiac, callback) {

  let today = new Date();
  let key = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}-${zodiac}`

  if (_todayZodiac[key]) {
    console.log("found today zodiac data with key:", key)
    return callback(null, _todayZodiac[key])
  }

  //Lets try to make a HTTP GET request to modulus.io's website.
  //Lets configure and request
  request({
    url: 'http://ngaydep.com/tu-vi-hang-ngay.html', //URL to hit
    //qs: {from: 'blog example', time: +new Date()}, //Query string data
    method: 'POST',
    //Lets post the following key/values as form
    form: {
      d: today.getDate(),
      m: today.getMonth() + 1,
      y: today.getFullYear(),
      alias: `${zodiac}`
    }
  }, function (error, response, body) {
    if (error) return callback(error);

    //Check for right status code
    if(response.statusCode !== 200){
      console.log('Invalid Status Code Returned:', response.statusCode);
      return callback(new Error(`Invalid Status Code Returned: ${response.statusCode}`))
    }

    //All is good. Print the body
    // console.log(body); // Show the HTML for the Modulus homepage.

    let $ = cheerio.load(body);
    let detail = $('.chitiet_hd p').text()
    // console.log('detail:', detail);

    // set today zodiac
    _todayZodiac[key] = detail

    callback(null, detail);
  });
}


module.exports = bot