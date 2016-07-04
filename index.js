'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

let bot = require('./bot')

// for Facebook verification
app.get('/webhook/', function (req, res) {
    return bot._verify(req, res)
})

app.post('/webhook/', function (req, res) {
	bot._handleMessage(req.body)
  	res.end(JSON.stringify({status: 'ok'}))
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})
