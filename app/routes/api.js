var bodyParser 	= require('body-parser');
var User		= require('../models/user');
var Team        = require('../models/team');
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
                        _id: user._id,
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
            user.hardware = req.body.hardware;
            user.software = req.body.software;
            user.virus = req.body.virus;
            user.google = req.body.google;
            user.data = req.body.data;
            user.service = req.body.service;
            user.level = 0;
            user.points = req.body.point;
            user.class = req.body.class;
            user.team = '';
        
			
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
                if(req.body.team) user.team = req.body.team;
                if(req.body.teamId) user.teamId = req.body.teamId;
                if(req.body.level) user.level = req.body.level;
				
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
    
    // on routes that end in /teams
    // ----------------------------------
    apiRouter.route('/teams')

		// create a team (accessed at POST http://localhost:8080/users)
		.post(function(req, res){
			var team = new Team();
			team.teamName = req.body.teamName;
            team.money = 100;
            team.level = 0;
            team.store_size = 'Small';
            team.created_by = req.body.created_by;
            team.newest_member = req.body.created_by;
            team.tools = 'basic';

            // Find the creator to add as the first member
            User.findOne({username : team.created_by}, function(err, user){
                if(err) return res.send(err);
                    
                    // push user to the members array
                    team.members.push(user);
                
                    // add the team to the users profile
                    user.team = team.teamName;
                    uesr.teamId = team._id;
                    user.save(function(err){
                        if(err) return res.send(err);
                    });
            
                // Save the team
                team.save(function(err){
				    if(err){
					   // duplicate entry
                        if(err.code == 11000)
                            return res.json({
                                success: false, 
                                message: 'A team with that name already exists.'
                            });
                        else
                            return res.send(err);
                    }
				
				// return a message 
				res.json({ message: 'Team created!'});
                });
            });     
		})
		
		// get all the teams (accessed at GET http://localhost:8080/api/teams)
		.get(function(req, res){
			Team.find({}, function(err, teams){
				if(err) res.send(err);
				
				//return the users
				res.json(teams);
			});
		});
    
    // on routes that end in /teams
    // ----------------------------------
    apiRouter.route('/teams/:team_id')
    
    // get the team with that id
    .get(function(req, res){
        Team.findById(req.params.team_id, function(err, team){
            if(err) res.send(err);
            
            // return the team
            res.json(team);
        });
    })
    
    // update the team with this id
    .put(function(req, res){
        Team.findById(req.params.team_id, function(err, team){
            
            if(err) return res.send(err);
            
            
            if(req.body.money) team.money = req.body.money;
            if(req.body.level) team.level = req.body.level;
            // set the new team information if it exists in the request
            if(req.body.newest_member){
                team.newest_member = req.body.newest_member;
                
                User.findOne({username : team.newest_member}, function(err, user){
                    if(err) return res.send(err);
                    
                    //push the user to the members array
                    team.members.push(user);
/*                    team.update(
                        {_id: team._id}, 
                        {$push:{members: user} },
                        function(error, success){
                            if(error){
                                console.log(error);
                            } else {
                                console.log(success);
                            }
                        });*/
                    
                    
                    // add the team to the users profile
                    user.team = team.teamName;
                    user.teamId = team._id;
                    user.save(function(err){
                        if(err) return res.send(err);
                    });
                    console.log(team);
                    
                    
                });
            };
            // Save the team
            team.markModified('members');
            team.markModified('User');
            team.save(function(err){
                if(err) return res.send(err);
                console.log(team);

            // return a message 
            res.json({ message: 'Team updated!'});
            });
        });
    });
    
/*    .put(function(req, res){
        
        if(req.body.newest_member){
        
        User.findOne({username : req.body.newest_member}, function(err, user){
                    if(err) return res.send(err);
                    
                    Team.findByIdAndUpdate(req.params.team_id, { $addoSet: {members: user}},
                        { "upsert": true, "new": true },
                        function(err, team){
                            if(err) return res.send(err);
                        
                            console.log('rawr');
                        
                            // add the team to the users profile
                            user.team = team.teamName;
                            user.save(function(err){
                                if(err) return res.send(err);
                            });
                        });        
                });
        }
    });*/
     
    
    // api endpoint to get user information
    // ------------------------------------
    apiRouter.get('/me', function(req, res){
        res.send(req.decoded);
        console.log(req.decoded);
    });
		
	return apiRouter;
};
