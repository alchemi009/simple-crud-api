var express = require('express')
var app = express()
const port = 3000
var mysql = require('mysql')

var myConnection  = require('express-myconnection')

var config = require('./config/db')
var dbOptions = {
    host:      config.database.host,
    user:       config.database.user,
    password: config.database.password,
    port:       config.database.port, 
    database: config.database.db
}

app.use(myConnection(mysql, dbOptions, 'pool'))

const conn = mysql.createConnection(dbOptions)

var bodyParser = require('body-parser')

/**
 * import routes/index.js
 */ 
var index = require('./routes/index')

// parse application/json
app.use(bodyParser.json());

app.use('/', index)

app.listen(port, () => console.log(`Server running at port ${port}!`))

//connect to database
conn.connect((err) =>{
  if(err) throw err;
  console.log('MySQL Connected...');
});



  
