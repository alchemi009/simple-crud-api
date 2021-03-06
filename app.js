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

app.set('view engine', 'ejs')


/**
 * import routes/index.js
 * import routes/api.js
 * import routes/items.js
 */ 
var index = require('./routes/index')
var api = require('./routes/api')
var items = require('./routes/items')

var expressValidator = require('express-validator')
app.use(expressValidator())

var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json());

var methodOverride = require('method-override')

app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

var flash = require('express-flash')
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(cookieParser('keyboard cat'))
app.use(session({ 
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))
app.use(flash())

app.use('/', index)
app.use('/api', api)
app.use('/items', items)

app.listen(port, () => console.log(`Server running at port ${port}!`))

//connect to database
conn.connect((err) =>{
  if(err) throw err;
  console.log('MySQL Connected...');
});



  
