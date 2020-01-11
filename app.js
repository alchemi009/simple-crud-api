var express = require('express')
var app = express()
const port = 3000

var bodyParser = require('body-parser')

/**
 * import routes/index.js
 */ 
var index = require('./routes/index')

// parse application/json
app.use(bodyParser.json());

app.use('/', index)
app.listen(port, () => console.log(`Server running at port ${port}!`))
