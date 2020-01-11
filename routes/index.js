var express = require('express')
var app = express()

app.get('/', (req, res) => res.send('Index route created!'))

module.exports = app;

