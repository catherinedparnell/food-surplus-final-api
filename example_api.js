/*
	Author: Connor Quigley Utsav Jalan, Dartmouth CS61, Spring 2020

	Add config.js file to root directory
	To run: nodemon api.js <local>
	App will use the database credentials and port stored in config.js for local

*/

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
		user     : config.database.user,  // think we need to do something here
		password : config.database.password,
		database : config.database.schema
	});
	connection.connect();
	next();
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// set up router
var router = express.Router();

// log request types to server console
router.use(function (req,res,next) {
	console.log("/" + req.method);
	next();
});

// set up routing
// calls should be made to /api/restaurants with GET/PUT/POST/DELETE verbs
// you can test GETs with a browser using URL http://localhost:3000/api/restaurants or http://localhost:3000/api/restaurants/30075445
// recommend Postman app for testing other verbs, find it at https://www.postman.com/
router.get("/",function(req,res){
	res.send("Yo!  This my API.  Call it right, or don't call it at all!");
});



// Get all employees
router.get("/api/employees",function(req,res){

	// Loads the hash from the DB
 	global.connection.query('SELECT employee_id, employee_password, admin_privilege FROM nyc_inspections.employees where employee_username like ?', [req.body.username],
	function (error, results, fields) {
			if (error) throw error;

			// checking that the username exists
			if(typeof results[0] !== 'undefined' && results[0]) {


				hash = results[0].employee_password;
				bcrypt.compare(req.body.password, hash, function(err, resi) {

					//check password and admin privilege
				  if(resi) {
						if(results[0].admin_privilege == 1) {

							// get all employees, return status code 200
							global.connection.query('SELECT employee_id, employee_name, hire_date, admin_privilege, employee_username, salary FROM nyc_inspections.employees', function (error, results, fields) {
								if (error) throw error;
								res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
							});
						} else {

							// get only the logged in employee, return status code 200
							global.connection.query('SELECT employee_id, employee_name, hire_date, admin_privilege, employee_username, salary FROM nyc_inspections.employees WHERE employee_id = ?', [results[0].employee_id], function (error, results, fields) {
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

// get employee with specific :id
router.get("/api/employees/:id",function(req,res){

	// Loads the hash from the DB
 	global.connection.query('SELECT employee_id, employee_password, admin_privilege FROM nyc_inspections.employees where employee_username like ?', [req.body.username],
	function (error, results, fields) {
			if (error) throw error;

			// checking that the username exists
			if(typeof results[0] !== 'undefined' && results[0]) {


			hash = results[0].employee_password;
			bcrypt.compare(req.body.password, hash, function(err, resi) {

				// check password and admin privilege
			  if(resi) {
					if((results[0].admin_privilege == 1) || (results[0].employee_id == req.params.id)) {

						  // get specific employee, return status code 200
						  global.connection.query('SELECT employee_id, employee_name, hire_date, admin_privilege, employee_username, salary FROM nyc_inspections.employees where employee_id = ?', [req.params.id], function (error, results, fields) {
							if (error) throw error;
							res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
						});
					} else {

						res.send(JSON.stringify({"status": 204, "error": true, "response": "Lacking Administration Privilege to Execute Query"}));

					}

			  } else {
			   		res.send(JSON.stringify({"status": 202, "error": true, "response": "wrong password"}));
			  }
				});

			} else {
				res.send(JSON.stringify({"status": 203, "error": true, "response": "Username Does Not Exist"}));
			}
		});
});

// PUT - UPDATE data in database, make sure to get the ID of the row to update from URL route, return status code 200 if successful
router.put("/api/employees/:id",function(req,res){


	// load hash from DB
	global.connection.query('SELECT employee_id, employee_password, admin_privilege FROM nyc_inspections.employees where employee_username like ?', [req.body.credentials.username],
	function (error, results, fields) {

		// checking that the username exists
		if(typeof results[0] !== 'undefined' && results[0]) {

			hash = results[0].employee_password;
			bcrypt.compare(req.body.credentials.password, hash, function(err, resi) {
				if(resi) {

					// creating a hashed password for the employee
					new_employee = req.body.data;
					bcrypt.hash(new_employee.employee_password, saltRounds, function(err, password_hash) {

						// If password was updated
						if(typeof password_hash !== 'undefined' && password_hash) {
							new_employee.employee_password = password_hash;
						}

						// check admin privilege
						if(results[0].admin_privilege == 1 || (results[0].employee_id == req.params.id)) {

							// Prevent someone from giving themselves admin privileges
							if(results[0].admin_privilege == 0 ) {
								new_employee.admin_privilege = 0;
							}

							// Update the DB
							global.connection.query('UPDATE nyc_inspections.employees SET ? WHERE employee_id = ?',[new_employee, req.params.id], function (error, results, fields) {
								if (error) {
									res.send(JSON.stringify({"status": 201, "error": true, "response": "invalid query: choose unique username and make sure data is formatted correctly"}));
								}
								else {
									res.send(JSON.stringify({"status": 200, "error": null, "response": "here on a put -- update employee with employee_id=" + req.params.id}));
								}});

						}  else {
								res.send(JSON.stringify({"status": 204, "error": true, "response": "Lacking Administration Privilege to Execute Query"}));
						}
					});
				} else {
					console.log("no match");
					res.send(JSON.stringify({"status": 202, "error": true, "response": "wrong password"}));
				}
			});
		} else {
			res.send(JSON.stringify({"status": 203, "error": true, "response": "username does not exist"}));
		}
	});
});

// POST -- create new employee
router.post("/api/employees",function(req,res){

	// Retrieve the username
	global.connection.query('SELECT employee_id, employee_password, admin_privilege FROM nyc_inspections.employees where employee_username like ?', [req.body.credentials.username],
	function (error, results, fields) {
			if (error) throw error;

			// checking that the username exists
			if(typeof results[0] !== 'undefined' && results[0]) {

				// getting the hashed password
				hash = results[0].employee_password;


				// comparing the hashed password to the plain text password passed in
				bcrypt.compare(req.body.credentials.password, hash, function(err, resi) {
					if(resi) {

							// creating a hashed password for the new employee
							new_employee = req.body.data;
							bcrypt.hash(new_employee.employee_password, saltRounds, function(err, password_hash) {
							new_employee.employee_password = password_hash;

								//checking admin privilege
								if(results[0].admin_privilege == 1) {
									// adding the employee to the DB
									global.connection.query('INSERT INTO nyc_inspections.employees SET ?', [new_employee], function (error, results, fields) {
										if (error) { 	res.send(JSON.stringify({"status": 201, "error": true, "response": "invalid query: choose unique username and make sure data is formatted correctly"}));}
										else {
										res.send(JSON.stringify({"status": 200, "error": null,
										"Location":"/api/restaurants/id of new restaurant here",
										"response": "here on a post -- create a new employee as " + req.body.data.employee_name})); }
									});
								} else {
									res.send(JSON.stringify({"status": 204, "error": true, "response": "Lacking Administration Privilege to Execute Query"}));
								}

							});
					} else {
						res.send(JSON.stringify({"status": 202, "error": null, "response": "wrong password"}));
					}
				});
			} else {
				res.send(JSON.stringify({"status": 203, "error": null, "response": "username does not exist"}));
			}
		});
});

// DELETE -- delete restaurant with RestaurantID of :id, return status code 200 if successful
router.delete("/api/employees/:id",function(req,res){

	// Loads the hash from the DB
 	global.connection.query('SELECT employee_id, employee_password, admin_privilege FROM nyc_inspections.employees where employee_username like ?', [req.body.username],
	function (error, results, fields) {
			if (error) throw error;

			// checking that the username exists
			if(typeof results[0] !== 'undefined' && results[0]) {


				hash = results[0].employee_password;
				bcrypt.compare(req.body.password, hash, function(err, resi) {
				  if(resi) {

						// Check admin privilege
						if (results[0].admin_privilege == 1) {
							global.connection.query('DELETE FROM  nyc_inspections.employees WHERE employee_id = ?',[req.params.id], function (error, results, fields) {
								if (error) throw error;
								res.send(JSON.stringify({"status": 200, "error": null, "response": "here on a delete -- remove restaurant with RestaurantID=" + req.params.id}));
							});
						} else {
								res.send(JSON.stringify({"status": 204, "error": true, "response": "Lacking Administration Privilege to Execute Query"}));
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



// start server running on port 3000 (or whatever is set in env)
app.use(express.static(__dirname + '/'));
app.use("/",router);
app.set( 'port', ( process.env.PORT || config.port || 3000 ));

app.listen(app.get( 'port' ), function() {
	console.log( 'Node server is running on port ' + app.get( 'port' ));
	console.log( 'Environment is ' + env);
});
