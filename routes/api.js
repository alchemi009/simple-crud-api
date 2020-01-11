var express = require('express')
var app = express()

//show restful api
app.get('/', function(req, res, next) {
    res.send('restful api route created!')
})

//show all items
app.get('/items', function(req, res, next) {
	req.getConnection(function(error, conn) {
		let sql = "SELECT * FROM items";
		conn.query(sql,(err, results) => {
			if(err) throw err;
			res.send({"status": 200, "error": null, "response": results});
		});

	})
})

//show single item
app.get('/items/:id', function(req, res, next) {
	req.getConnection(function(error, conn) {
		let sql = "SELECT * FROM items WHERE id="+req.params.id;
		conn.query(sql,(err, results) => {
			if(err) throw err;
			res.send({"status": 200, "error": null, "response": results});
		});

	})
})

//add new item
app.post('/items', function(req, res, next) {
    req.getConnection(function(error, conn) {
        let data = {name: req.body.name, qty: req.body.qty, amount: req.body.amount};
        let sql = "INSERT INTO items SET ?";
        conn.query(sql, data,(err, results) => {
            if(err) throw err;
            res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
        });
    })  
});

//update item
app.put('/items/:id', function(req, res, next) {
    req.getConnection(function(error, conn) {
        let sql = "UPDATE items SET name='"+req.body.name+"', qty='"+req.body.qty+"', amount='"+req.body.amount+"'WHERE id="+req.params.id;
        conn.query(sql, (err, results) => {
        if(err) throw err;
        res.send({"status": 200, "error": null, "response": results});
        });
    })

});

//delete item
app.delete('/items/:id', function(req, res, next) {
    req.getConnection(function(error, conn) {
      let sql = "DELETE FROM items WHERE id="+req.params.id+"";
      conn.query(sql, (err, results) => {
        if(err) throw err;
          res.send({"status": 200, "error": null, "response": results});
      });
    })
});

module.exports = app;

