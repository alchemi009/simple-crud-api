var express = require('express')
var app = express()

// SHOW LIST OF ITEMS
app.get('/', function(req, res, next) {
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM items ORDER BY id DESC',function(err, rows, fields) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				res.render('item/list', {
					title: 'List of Items', 
					data: ''
				})
			} else {
				// render to views/item/list.ejs template file
				res.render('item/list', {
					title: 'List of Items', 
					data: rows
				})
			}
		})
	})
})



// SHOW ADD ITEM FORM
app.get('/add', function(req, res, next){	
	// render to views/user/add.ejs
	res.render('item/add', {
		title: 'Add New Item',
		name: '',
		qty: '',
		amount: ''		
	})
})

// ADD NEW ITEM POST ACTION
app.post('/add', function(req, res, next){	
	req.assert('name', 'Name is required').notEmpty()           //Validate name
	req.assert('qty', 'Quantity is required').notEmpty()             //Validate quantiy
	req.assert('amount', 'Amount is required').notEmpty()             //Validate amount

    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
		
		/********************************************
		 * Express-validator module
		 
		req.body.comment = 'a <span>comment</span>';
		req.body.username = '   a user    ';

		req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
		req.sanitize('username').trim(); // returns 'a user'
		********************************************/
		var item = {
			name: req.sanitize('name').escape().trim(),
			qty: req.sanitize('qty').escape().trim(),
			amount: req.sanitize('amount').escape().trim()
		}
		
		req.getConnection(function(error, conn) {
			conn.query('INSERT INTO items SET ?', item, function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)
					
					// render to views/user/add.ejs
					res.render('item/add', {
						title: 'Add New Item',
						name: item.name,
						qty: item.qty,
						amount: item.amount					
					})
				} else {				
					req.flash('success', 'Data added successfully!')
					
					// render to views/item/add.ejs
					res.render('item/add', {
						title: 'Add New Item',
						name: '',
						qty: '',
						amount: ''					
					})
				}
			})
		})
	}
	else {   //Display errors to user
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})				
		req.flash('error', error_msg)		
		
		/**
		 * Using req.body.name 
		 * because req.param('name') is deprecated
		 */ 
        res.render('item/add', { 
            title: 'Add New Item',
            name: req.body.name,
            qty: req.body.qty,
            amount: req.body.amount
        })
    }
})

// SHOW EDIT USER FORM
app.get('/edit/(:id)', function(req, res, next){
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM items WHERE id = ?', [req.params.id], function(err, rows, fields) {
			if(err) throw err
			
			// if user not found
			if (rows.length <= 0) {
				req.flash('error', 'Item not found with id = ' + req.params.id)
				res.redirect('/items')
			}
			else { // if user found
				// render to views/user/edit.ejs template file
				res.render('item/edit', {
					title: 'Edit Item', 
					//data: rows[0],
					id: rows[0].id,
					name: rows[0].name,
					qty: rows[0].qty,
					amount: rows[0].amount					
				})
			}			
		})
	})
})

// EDIT USER POST ACTION
app.put('/edit/(:id)', function(req, res, next) {
	req.assert('name', 'Name is required').notEmpty()           //Validate name
	req.assert('qty', 'Quantity is required').notEmpty()             //Validate quantity
	req.assert('amount', 'Amount is required').notEmpty()             //Validate amount

    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
		
		/********************************************
		 * Express-validator module
		 
		req.body.comment = 'a <span>comment</span>';
		req.body.username = '   a user    ';

		req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
		req.sanitize('username').trim(); // returns 'a user'
		********************************************/
		var item = {
			name: req.sanitize('name').escape().trim(),
			qty: req.sanitize('qty').escape().trim(),
			amount: req.sanitize('amount').escape().trim()
		}
		
		req.getConnection(function(error, conn) {
			conn.query('UPDATE items SET ? WHERE id = ' + req.params.id, item, function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)
					
					// render to views/user/add.ejs
					res.render('item/edit', {
						title: 'Edit Item',
						id: req.params.id,
						name: req.body.name,
						qty: req.body.qty,
						amount: req.body.amount
					})
				} else {
					req.flash('success', 'Data updated successfully!')
					
					// render to views/item/edit.ejs
					res.render('item/edit', {
						title: 'Edit Item',
						id: req.params.id,
						name: req.body.name,
						qty: req.body.qty,
						amount: req.body.amount
					})
				}
			})
		})
	}
	else {   //Display errors to user
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)
		
		/**
		 * Using req.body.name 
		 * because req.param('name') is deprecated
		 */ 
        res.render('item/edit', { 
            title: 'Edit Item',            
			id: req.params.id, 
			name: req.body.name,
			qty: req.body.qty,
			amount: req.body.amount
        })
    }
})

// DELETE ITEM
app.delete('/delete/(:id)', function(req, res, next) {
	var item = { id: req.params.id }
	
	req.getConnection(function(error, conn) {
		conn.query('DELETE FROM items WHERE id = ' + req.params.id, item, function(err, result) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				// redirect to items list page
				res.redirect('/items')
			} else {
				req.flash('success', 'User deleted successfully! id = ' + req.params.id)
				// redirect to items list page
				res.redirect('/items')
			}
		})
	})
})

module.exports = app
