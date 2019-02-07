require('dotenv').config();
const cors = require('cors');
const express = require('express');
const expressJwt = require('express-jwt');
const logger = require('morgan'); //logger for error reporting in the terminal
const path = require('path');

// App instance
const app = express();

// Set up middleware
app.use(logger('dev'));
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: false}));

// Helper function: This allows our server to parse the incoming token from the client
// This is being run as middleware, so it has access to the incoming request
function fromRequest(req){
  if(req.body.headers.Authorization &&
    req.body.headers.Authorization.split(' ')[0] === 'Bearer'){
    return req.body.headers.Authorization.split(' ')[1];
  }
  return null;
}

/// CORS fix?

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//////

// Controllers
// Remember to pass the JWT_SECRET to ExpressJWT (it will break without it!)
// NOTE on ExpressJWT: The unless portion is only needed if you need exceptions
app.use('/auth', expressJwt({ 
	secret: process.env.JWT_SECRET_KEY,
	getToken: fromRequest
}).unless({
	path: [{ url: '/auth/login', methods: ['POST']}, { url: '/auth/signup', methods: ['POST'] }]
}), require('./controllers/auth'));
app.use('/habits', require('./controllers/habits'))

// This is the catch-all route. Ideally you don't get here unless you made a mistake on your front-end
app.get('*', function(req, res, next) {
	res.status(404).send({ message: 'Not Found' });
});

// Listen on specified PORT or default to 3000
app.listen(process.env.PORT || 3000);
