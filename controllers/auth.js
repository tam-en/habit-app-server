require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const db = require('../models');

// POST /auth/login route - returns a JWT
router.post('/login', (req, res) => {
  //res.send('POST /auth/signup');
	// TODO: debug statements; remover when no longer needed
	console.log('In the POST auth/login route');
	console.log(req.body);  

	// Find out if user is in db (for login, you would hope so)
	db.User.findOne({ email: req.body.email })
	.then(user => {
		// make sure there's a user AND a password
		if(!user || !user.password){
			return res.status(400).send('User not found')
		};

		// now that we know there's a user and password, check to see if they're in the db
		if(!user.isAuthenticated(req.body.password)){
			//invalid user
			return res.status(401).send('Invalid credentials.')
		};

		// valid user, password autheticated. now they need a token.
		const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET_KEY, {
			expiresIn: 60 * 60 * 24 //24 hours in seconds
		});

		// send the token!
		res.send({ token: token });
	})
	.catch(err => {
		console.log('Error finding user in POST /auth/login:', err);
		res.status(503).send('Database Error.');
	})
});

// POST /auth/signup route - create a user in the DB and then log them in
router.post('/signup', (req, res) => {
	// TODO: debug statements; remover when no longer needed
	console.log('In the POST auth/signup route');
	console.log(req.body);
	db.User.findOne({ email: req.body.email })
	.then(user => {
		if(user){
			//if user already exists, don't allow duplicate account
			return res.status(409).send('That email is already in use.');
		}
		db.User.create(req.body)
		.then(createdUser => {
			// We created a new user. Now we need to create and send a token for them.
			const token = jwt.sign(createdUser.toJSON(), process.env.JWT_SECRET_KEY, {
				expiresIn: 60 * 60 * 24 //24 hours in seconds
			});
			res.send({token: token});
		})
		.catch(err => {
			console.log("error creating a new user in POST auth/signup", err);
			res.status(403).send('database error')
		})
	})
	.catch(err => {
		console.log("error on the POST auth/signup route:", err);
		res.status(500).send('database error.');
	});
});

// This is what is returned when client queries for new user data
router.post('/current/user', (req, res) => {
  // TODO: Remove this console log when not needed anymore
  console.log('GET /auth/current/user STUB');

  if(!req.user || !req.user.id){
  	return res.status(401).send({ user: null });
  }

  db.User.findById(req.user.id)
  .then(user => {
  	res.send({ user: user });
  })
  .catch(err => {
  	console.log('Error in GET /current/user route:', err);
  	res.status(503).send( {user: null} );
  })
});

module.exports = router;