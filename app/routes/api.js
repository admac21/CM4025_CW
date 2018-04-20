var bodyParser 	= require('body-parser');
var User		= require('../models/user');
var Customer    = require('../models/customer');
var Product     = require('../models/product');
var Job         = require('../models/job');
var Note        = require('../models/note');
var jwt			= require('jsonwebtoken');
var config		= require('../../config');

// super secret for creating tokens
var superSecret = config.secret;

module.exports = function (app, express) {

	//ROUTES FOR OUR API
	//===================================

	// get an instance of the express router
	var apiRouter = express.Router();
	
	// route to authenticate a user (POST http://localhost:8080/api/authenticate)
	apiRouter.post('/authenticate', function(req, res) {
		
		console.log(req.body.username);
		
		//find the user
		User.findOne({
			username: req.body.username
		}).select('name username password').exec(function (err, user) {
			
			if (err) throw err;
			
			// no user with that username was found
			if (!user) {
				res.json({
					success: false,
					message: 'Authentication failed. No user was found.'
				});
			} else if (user) {
				
				// check if password matches
				var validPassword = user.comparePassword(req.body.password);
				if(!validPassword){
					res.json({
						success: false,
						message: 'Authentication failed. Incorrect password.'
					});
				} else {
					
					// if user is found and password is right
					// create a token
					var token = jwt.sign({
						name: user.name,
						username: user.username
					}, superSecret, {
						expiresIn: '24h' // expires in 24 hours
					});
					
					// return the information including the token as JSON
					res.json({
						success: true,
						message: 'Enjoy your token!',
						token: token
					});
				}
			}
		});
	});

	// route middleware to verify a token
	apiRouter.use(function(req, res, next){
		// do logging
		console.log('Somebody just came to our app!');
		
		// check header or url parameters or post parameters for token
		var token = req.body.token || req.query.token || req.headers['x-access-token'];
		
		//decode token
		if(token){
			
			// verifies secret and checks exp
			jwt.verify(token, superSecret, function(err, decoded){
				if (err){
					res.status(403).send({
						success: false,
						message: 'Failed to authenticate token.'
						});
				} else {
					// if everything is good, save to request for use in other routes
					req.decoded = decoded;
					next(); // make sure we go to next routes and don't stop here
				}
			});		
			
		} else {
			
			// if there is no token
			// return an HTTP response of 403 (access forbidden) and an error message
			return res.status(403).send({
				success: false,
				message: 'No token provided.' 
			});
		}
	});
	
    // test route to make sure everything is working 
	// accessed at GET http://localhost:8080/api
	apiRouter.get('/', function(req, res)
	{
		res.json({message: 'hooray! welcome to our api!'});
	});

	// on routes that end in /users
	// ----------------------------------
	apiRouter.route('/users')

		// create a user (accessed at POST http://localhost:8080/users)
		.post(function(req, res){
			var user = new User();				// create a new instance of the User models/user
			user.name = req.body.name;			// set the users name (comes from the request)
			user.username = req.body.username; 	// set the users username (comes from the request)
			user.password = req.body.password;	// set the users password (comes from the request)
			
			user.save(function(err){
				if(err){
					// duplicate entry
					if(err.code == 11000)
						return res.json({
							success: false, 
                            message: 'A user with that username already exists.'
						});
					else
						return res.send(err);
				}
				
				// return a message 
				res.json({ message: 'User created!'});
			});
		})
		
		// get all the users (accessed at GET http://localhost:8080/api/users)
		.get(function(req, res){
			User.find({}, function(err, users){
				if(err) res.send(err);
				
				//return the users
				res.json(users);
			});
		});

	// on routes that end in /users:user_id
	// ----------------------------------	
	apiRouter.route('/users/:user_id')

		// get the user with that id
		.get(function(req, res){
			User.findById(req.params.user_id, function(err, user){
				if(err) res.send(err);
				
				//return that user
				res.json(user);
			});
		})
		
		// update the user with this id
		.put(function(req, res){
			User.findById(req.params.user_id, function(err, user){
				
				if(err) return res.send(err);
				
				// set the new user information if it exists in the request
				if(req.body.name) user.name = req.body.name;
				if(req.body.username) user.username = req.body.username;
				if(req.body.password) user.password = req.body.password;
				
				// save the user
				user.save(function(err){
					if(err) return res.send(err);
					
					// return a message
					res.json({ message: 'User updated!'});
				});
			});
		})
		
		// delete the user with this id
		.delete(function(req, res){
			User.remove({
				_id: req.params.user_id
			}, function(err, user){
				if(err) res.send(err);
				
				res.json({
                    message: 'Successfully deleted'
                });
			});
		});
    
    // on routes that end in /customers
    // ----------------------------------
    apiRouter.route('/customers')

        // create a customer (access at POST http://localhost:8080/customers)
        .post(function(req, res) {
            var customer = new Customer(); // create a new instance of Customer model
            customer.title = req.body.title; // set the customer title 
            customer.first_name = req.body.first_name;  // set the customer first name (comes from request)
            customer.last_name = req.body.last_name; // set the customer last name
            customer.phone = req.body.phone; // set the customer phone number
            customer.alt_phone = req.body.alt_phone;
            customer.email = req.body.email // set the customer email
            customer.house = req.body.house
            customer.street = req.body.street
            customer.city = req.body.city
            customer.postcode = req.body.postcode

            customer.save(function(err) {
                if(err){
                    // duplicate entry
                    if(err.code == 11000)
                        return res.json({
                            success: false, 
                            message: 'A customer with that name already exists.'
                        });
                    else
                        return res.send(err);
                }

                // return a message
                res.json({ message: 'Customer created!' });
            });
        })

    //get all the customer (accessed at GET http://localhost:8080/api/customers)
    .get(function(req, res) {
        Customer.find(function(err, customers){
            if(err) return res.send(err);

            // return the customers
            res.json(customers);
        });
    });

	// on routes that end in /customers:customer_id
	// ----------------------------------	
	apiRouter.route('/customers/:customer_id')

		// get the customer with that id
		.get(function(req, res){
			Customer.findById(req.params.customer_id, function(err, customer){
				if(err) res.send(err);
				
				//return that customer
				res.json(customer);
			});
		})
		
		// update the customer with this id
		.put(function(req, res){
			Customer.findById(req.params.customer_id, function(err, customer){
				
				if(err) return res.send(err);
				
				// set the new customer information if it exists in the request
				if(req.body.title) customer.title = req.body.title;
				if(req.body.first_name) customer.first_name = req.body.first_name;
				if(req.body.last_name) customer.last_name = req.body.last_name;
                if(req.body.phone) customer.phone = req.body.phone;
                if(req.body.alt_phone) customer.alt_phone = req.body.alt_phone;
                if(req.body.email) customer.email = req.body.email;
                if(req.body.house) customer.house = req.body.house;
                if(req.body.street) customer.street = req.body.street;
                if(req.body.city) customer.city = req.body.city;
                if(req.body.postcode) customer.postcode = req.body.postcode;
				
				// save the customer
				customer.save(function(err){
					if(err) return res.send(err);
					
					// return a message
					res.json({ message: 'Customer updated!'});
				});
			});
		})
		
		// delete the customer with this id
		.delete(function(req, res){
			Customer.remove({
				_id: req.params.customer_id
			}, function(err, customer){
				if(err) res.send(err);
				
				res.json({
                    message: 'Successfully deleted'
                });
			});
		});
    
    // on routes that end in /products
	// ----------------------------------
    apiRouter.route('/products')
    
    // create a product (accessed at POST http://localhost:8080/products)
    .post(function(req, res){
        var product = new Product(); // create an instance of the product model
        product.make = req.body.make; // set the products make (comes from request)
        product.model = req.body.model; // set the products model (comes from request)
        product.type = req.body.type;   // set the products type (comes from request)
        product.colour = req.body.colour; // set the products colour
        product.serial = req.body.serial; // set the products serial number (comes from request)
        product.cust_id = req.body.cust_id; // set the products owner id
        product.dop = req.body.dop;
        
        product.save(function(err){
            if(err){
                // duplicate entry
                if(err.code == 11000)
                    return res.json({
                        success: false,
                        message: 'A product with that serial number already exists.'
                    });
                else
                    return res.send(err);
            }
            
            // return a message
            res.json({ message: 'Product created!' });
        });
    })
    
    // get all the products (accessed at GET http://localhost:8080/api/products)
    .get(function(req, res){
        Product.find({}, function(err, products){
           if(err) res.send(err);
            
            // return the products
            res.json(products);
        });
    });
    
    // on routes that end in /product:product_id
	// ----------------------------------
    apiRouter.route('/products/:product_id')
    
    // get the product with that id
    .get(function(req, res){
        Product.findById(req.params.product_id, function(err, product){
            if(err) res.send(err);
            
            // return that product
            res.json(product);
        });
    })
    
    // update the product with this id
    .put(function(req, res){
        Product.findById(req.params.product_id, function(err, product){
            
            if(err) return res.send(err);
            
            // set the new product information if it exists in the request
            if(req.body.make) product.make = req.body.make;
            if(req.body.model) product.model = req.body.model;
            if(req.body.type) product.type = req.body.type;
            if(req.body.colour) product.colour = req.body.colour;
            if(req.body.serial) product.serial = req.body.serial;
            if(req.body.dop) product.dop = req.body.dop;
                        
            // save the product
            product.save(function(err){
                if(err) return res.send(err);
                
                // return a message
                res.json({ message: 'Product updated!' });
            });
        });
    })
    
    // delete the product with this id
    .delete(function(req, res){
        Product.remove({
            _id: req.params.product_id
        }, function(err, product){
            if(err) res.send(err);
            
            res.json({ message: 'Successfully deleted' });
        });
    });
    
    // on routes that end in /jobs
    // ----------------------------------
    apiRouter.route('/jobs')
    
    // create a job (accessed at POST http://localhost:8080/jobs)
    .post(function(req, res){
        var job = new Job();        // create a new instance of the Job model
        job.created_by  = req.body.created_by;
        job.product_id  = req.body.product_id;
        job.condition   = req.body.condition;
        job.short_desc  = req.body.short_desc;
        job.status      = 'Booked In';
        job.accessories = 'None';
        job.full_desc   = req.body.full_desc;
        job.passwords   = req.body.passwords;
        if(req.body.accessories) job.accessories = req.body.accessories;
    
        // Add notes
        /*job.notes.push({ note: req.body.note, left_by: req.body.created_by });*/
        
        job.save(function(err){
            if(err){
                // duplicate entry
                if(err.code == 11000)
                    return res.json({
                        success: false,
                        message: 'error'
                    });
                else
                    return res.send(err);
            }

            // return a message
            res.json({ message: 'Job Created!' });
        });
    })
        
        
    // get all the jobs (accessed at GET http://localhost:8080/api/jobs)
    .get(function(req, res){
        Job.find({}, function(err, jobs){
            if(err) res.send(err);
            
            // return the jobs
            res.json(jobs);
        });
    });
    
    // on routes that end in /job:job_id
	// ----------------------------------
    apiRouter.route('/jobs/:job_id')
    
    // get the job with that id
    .get(function(req, res){
        Job.findById(req.params.job_id, function(err, job){
            if(err) res.send(err);
            
            // return that job
            res.json(job);
        });
    })
    
/*    // update the job with this id
    .put(function(req, res){
        Job.findById(req.params.job_id, function(err, job){
            
            if(err) return res.send(err);
            
            // set the new job information if it exists in the request
            if(req.body.make) job.condition = req.body.condition;
            if(req.body.accessories) job.accessories = req.body.accessories;
            if(req.body.passwords) job.passwords = req.body.passwords;
                        
            // save the job
            job.save(function(err){
                if(err) return res.send(err);
                
                // return a message
                res.json({ message: 'Job updated!' });
            });
        });
    })*/
    
    .put(function(req, res){
        
        var note = new Note();
            note.left_by = req.body.left_by; 
            note.note = req.body.note;
            
            Job.update({_id: req.params.job_id}, {$push: { notes: note }}, {upsert: true}, function(err){
                if(err){
                    return res.send(err);
                }
            });
        
        Job.findById(req.params.job_id, function(err, job){
            if(err) return res.send(err);

            //job.notes.push({ note: req.body.note, left_by: req.body.left_by});
            //job.condition = 'Good';
            
            /*job.notes.update({_id: req.params.job_id}, {$push: {note: req.body.note, left_by: req.body.left_by}});*/
            
            
                
            
            
            console.log(job)
/*            job.update({
                $push: {
                    "note" : {
                    "note": req.body.note,
                    "left_by" : req.body.left_by
                    }
                } 
            })*/
            job.markModified('notes');
            
            job.save(function(err){
                if(err) return res.send(err);
                
                res.json({ message: 'Note added!' });
            });
            
        });
    })
    
    // delete the job with this id
    .delete(function(req, res){
        Job.remove({
            _id: req.params.job_id
        }, function(err, job){
            if(err) res.send(err);
            
            res.json({ message: 'Successfully deleted' });
        });
    });
    
    
    
    // api endpoint to get user information
    // ------------------------------------
    apiRouter.get('/me', function(req, res){
        res.send(req.decoded);
    });
		
	return apiRouter;
};

