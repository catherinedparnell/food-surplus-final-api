// Authors: Connor Quigley, Catherine Parnell, Satch Baker, Archer Chapin
// Based on the lab3 scaffold

// bcrypt for password storage
const bcrypt = require('bcrypt');
const saltRounds = 10;

var express=require('express');
let mysql = require('mysql');
const bodyParser = require('body-parser'); //allows us to get passed in api calls easily
var app=express();

// get config
var env = process.argv[2] || 'local'; //use localhost if enviroment not specified
var config = require('./config')[env]; //read credentials from config.js


//Database connection
app.use(function(req, res, next){
	global.connection = mysql.createConnection({
		host     : config.database.host,
		user     : config.database.user,
		password : config.database.password,
		database : config.database.schema
	});
	connection.connect();
	next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set up router
var router = express.Router();

// log request types to server console
router.use(function (req,res,next) {
	console.log("/" + req.method);
	next();
});

// set up routing
router.get("/api/",function(req,res){
	res.send("Yo!  This my API.  Call it right, or don't call it at all!");
});

// GET - get supply or demand depending on the type of user asking
router.post("/api/product",function(req,res){

	// Loads the hash
	global.connection.query('SELECT UserID, Username, Password, Role  FROM FoodSurplus_sp20.Users where Username like ?', [req.body.Username],
	function (error, results, fields) {


		// checking that the username exists
		if(typeof results[0] !== 'undefined' && results[0]) {

			// check password
			hash = results[0].Password;
			bcrypt.compare(req.body.Password, hash, function(err, resi) {

				if(resi) {

					if(results[0].Role == "S") {

						// Supplier wants to see demand
						global.connection.query('call getSupplyDemand(?)','D', function (error, results, fields) {
							if (error) throw error;
							res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
						});

					} else if (results[0].Role == "D") {

						// Demander wants to see supply
						global.connection.query('call getSupplyDemand(?)','S', function (error, results, fields) {
							if (error) throw error;
							res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
						});

					}
				} else {
					res.send(JSON.stringify({"status": 202, "error": true, "response": "wrong password"}));
				}
			});
		} else {
			res.send(JSON.stringify({"status": 203, "error": true, "response": "username does not exist"}));
		}
	});
});

// GET - get a specific product
router.post("/api/product/:id",function(req,res){

	// Loads the hash
	global.connection.query('SELECT UserID, Username, Password, Role  FROM FoodSurplus_sp20.Users where Username like ?', [req.body.Username],
	function (error, results, fields) {

		// checking that the username exists
		if(typeof results[0] !== 'undefined' && results[0]) {

			// check password
			hash = results[0].Password;
			bcrypt.compare(req.body.Password, hash, function(err, resi) {

				if(resi) {

					if(results[0].Role == "producer") {

						// SQL to get all demand

					} else if (results[0].Role == "supplier") {

						// SQL to get all supply

					}
				} else {
					res.send(JSON.stringify({"status": 202, "error": true, "response": "wrong password"}));
				}
			});
		} else {
			res.send(JSON.stringify({"status": 203, "error": true, "response": "username does not exist"}));
		}
	});
});

// Allows a user to see  their profile
router.post("/api/user_profile",function(req,res){

		// Loads the hash
		global.connection.query('SELECT UserID, Username, Password, Role  FROM FoodSurplus_sp20.Users where Username like ?', [req.body.Username],
		function (error, results, fields) {

			// checking that the username exists
			if(typeof results[0] !== 'undefined' && results[0]) {

				// check password
				hash = results[0].Password;
				bcrypt.compare(req.body.Password, hash, function(err, resi) {

					if(resi) {

						global.connection.query('call getUserProfile(?)', results[0].UserID, function (error, results, fields) {
							if (error) throw error;
							res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
						});

					} else {
						res.send(JSON.stringify({"status": 202, "error": true, "response": "wrong password"}));
					}
				});
			} else {
				res.send(JSON.stringify({"status": 203, "error": true, "response": "username does not exist"}));
			}
		});
	});

// Allows a user to see all their own data
router.post("/api/user",function(req,res){

		// Loads the hash
		global.connection.query('SELECT UserID, Username, Password, Role  FROM FoodSurplus_sp20.Users where Username like ?', [req.body.Username],
		function (error, results, fields) {

			// checking that the username exists
			if(typeof results[0] !== 'undefined' && results[0]) {

				// check password
				hash = results[0].Password;
				bcrypt.compare(req.body.Password, hash, function(err, resi) {

					if(resi) {

						global.connection.query('call getProductsUser(?)', results[0].UserID, function (error, results, fields) {
							if (error) throw error;
							res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
						});

					} else {
						res.send(JSON.stringify({"status": 202, "error": true, "response": "wrong password"}));
					}
				});
			} else {
				res.send(JSON.stringify({"status": 203, "error": true, "response": "username does not exist"}));
			}
		});
	});


// PUT - UPDATE user's user data
router.put("/api/user_update",function(req,res){


	// Loads the hash
	global.connection.query('SELECT UserID, Username, Password, Role  FROM FoodSurplus_sp20.Users where Username like ?', [req.body.Username],
	function (error, results, fields) {

		// checking that the username exists
		if(typeof results[0] !== 'undefined' && results[0]) {

			// check password
			hash = results[0].Password;
			bcrypt.compare(req.body.Password, hash, function(err, resi) {

				if(resi) {

					// Create new password
					// creating a hashed password for the employee
					updated_user = req.body.data;
					bcrypt.hash(updated_user.Password, saltRounds, function(err, password_hash) {

						// if password was updated
						if(typeof password_hash !== 'undefined' && password_hash) {
							updated_user.Password = password_hash;
						}

						// Update the DB
						global.connection.query('UPDATE FoodSurplus_sp20.Users SET ? WHERE UserID = ?',[updated_user, results[0].UserID], function (error, results, fields) {
							if (error) {
								res.send(JSON.stringify({"status": 201, "error": true, "response": "invalid query"}));
							}
							else {
								res.send(JSON.stringify({"status": 200, "error": null, "response": "here on a put -- update User with Username=" + updated_user.Username}));
							}});

					});
				} else {
					res.send(JSON.stringify({"status": 202, "error": true, "response": "wrong password"}));
				}
			});
		} else {
			res.send(JSON.stringify({"status": 203, "error": true, "response": "username does not exist"}));
		}
	});
});

// update a specific product
router.post("/api/product_update/:id",function(req,res){


	// Loads the hash
	global.connection.query('SELECT UserID, Username, Password, Role  FROM FoodSurplus_sp20.Users where Username like ?', [req.body.Username],
	function (error, results, fields) {

		// checking that the username exists
		if(typeof results[0] !== 'undefined' && results[0]) {

			// check password
			hash = results[0].Password;
			bcrypt.compare(req.body.Password, hash, function(err, resi) {

				if(resi) {


					update_data = {};
					if (req.body.SellBy !== '' && req.body.SellBy !== null)  {
						update_data.SellBy = req.body.SellBy
					}
					if (req.body.Qty !== '' && req.body.Qty !== null)  {
						update_data.Qty = req.body.Qty
					}

					// Update the DB
					global.connection.query('UPDATE FoodSurplus_sp20.Products SET ? WHERE ProductID = ?',[update_data, req.params.id], function (error, results, fields) {
						if (error) {
							res.send(JSON.stringify({"status": 201, "error": true, "response": "invalid query"}));
						}
						else {
							res.send(JSON.stringify({"status": 200, "error": null, "response": "here on a put -- update Product with ID=" + req.params.id}));
						}});

				} else {
					res.send(JSON.stringify({"status": 202, "error": true, "response": "wrong password"}));
				}
			});
		} else {
			res.send(JSON.stringify({"status": 203, "error": true, "response": "username does not exist"}));
		}
	});
});

// POST -- create new user
router.post("/api/user_create",function(req,res){

			new_user = req.body;
			bcrypt.hash(new_user.Password, saltRounds, function(err, password_hash) {

				new_user.Password = password_hash;


					// Update the DB
					global.connection.query('insert into FoodSurplus_sp20.Users SET ?',[new_user], function (error, results, fields) {
						if (error) {
							res.send(JSON.stringify({"status": 201, "error": true, "response": "invalid query"}));
						}
						else {
							res.send(JSON.stringify({"status": 200, "error": null, "response": "here on a post -- created User"}));
						}});
			});
});

// POST -- create new product
router.post("/api/product_create",function(req,res){
	console.log(req.body)
	// Loads the hash
	global.connection.query('SELECT UserID, Username, Password, Role  FROM FoodSurplus_sp20.Users where Username like ?', [req.body.Username],
	function (error, results, fields) {

		// checking that the username exists
		if(typeof results[0] !== 'undefined' && results[0]) {
            console.log('results', results)
			// check password
			hash = results[0].Password;
			bcrypt.compare(req.body.Password, hash, function(err, resi) {

				if(resi) {
					// Update the DB
					global.connection.query('call createProductEntry(?, ?, ?, ?, ?, ?, ?)',[req.body.ProductName, req.body.BrandName, req.body.SellBy, req.body.SupplyDemand, req.body.Qty, req.body.Organic, results[0].UserID], function (error, results, fields) {
						if (error) {
							res.send(JSON.stringify({"status": 201, "error": true, "response": "invalid query"}));
						}
						else {
							res.send(JSON.stringify({"status": 200, "error": null, "response": "here on a post -- created Product with ID="}));
						}});


				} else {
					res.send(JSON.stringify({"status": 202, "error": true, "response": "wrong password"}));
				}
			});
		} else {
			res.send(JSON.stringify({"status": 203, "error": true, "response": "username does not exist"}));
		}
	});
});

router.post("/api/products/:id",function(req,res){

	// Loads the hash
	global.connection.query('SELECT UserID, Username, Password, Role  FROM FoodSurplus_sp20.Users where Username like ?', [req.body.Username],
	function (error, results, fields) {

		// checking that the username exists
		if(typeof results[0] !== 'undefined' && results[0]) {

			// check password
			hash = results[0].Password;
			bcrypt.compare(req.body.Password, hash, function(err, resi) {

				if(resi) {

					global.connection.query('DELETE FROM  FoodSurplus_sp20.Products WHERE ProductID = ?',[req.params.id], function (error, results, fields) {
						if (error) throw error;
						res.send(JSON.stringify({"status": 200, "error": null, "response": "here on a delete -- remove product with ProductID=" + req.params.id}));
					});

				} else {
					res.send(JSON.stringify({"status": 202, "error": true, "response": "wrong password"}));
				}
			});
		} else {
			res.send(JSON.stringify({"status": 203, "error": true, "response": "username does not exist"}));
		}
	});
});

app.use(function (req, res, next) {
	/*var err = new Error('Not Found');
	 err.status = 404;
	 next(err);*/

	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', '*');

	// Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

	// Request headers you wish to allow
	res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');

  //  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

	// Pass to next layer of middleware
	next();
  });



// start server running on port 3000 (or whatever is set in env)
app.use(express.static(__dirname + '/'));
app.use("/",router);
app.set( 'port', ( process.env.PORT || config.port || 3000 ));

app.listen(app.get( 'port' ), function() {
	console.log( 'Node server is running on port ' + app.get( 'port' ));
	console.log( 'Environment is ' + env);
});
