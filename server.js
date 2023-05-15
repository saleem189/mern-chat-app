const express = require("express");
const session = require('express-session');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config()
const api_routes = require("./Routes/auth_routes");
const { MONGO_URI, SERVER_PORT } = require("./configurations/constants");
const redisClient = require("./configurations/redis");
const app = express();

// Bodyparser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));

/**
 * Configures session middleware with the given options.
 *
 * @param {object} options - The options to use when configuring session middleware.
 */
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  // cookie: { secure: true }
}));


/**
 * Initializes Passport authentication middleware.
 */
app.use(passport.initialize());

/**
 * Uses Passport middleware to maintain persistent login sessions.
 */
app.use(passport.session());


/**
 * Configures Passport authentication middleware with the given Passport instance.
 *
 * @param {object} passport - The Passport instance to configure.
 */
require("./configurations/passport")(passport);


/**
 * Opens a connection to the Redis server using the Redis client.
 *
 * @returns {Promise} A promise that resolves when the connection is successful, and rejects if there is an error.
 */
redisClient.connect();


/**
 * Mounts the given API routes on the '/api/users' path.
 *
 * @param {string} path - The path to mount the routes on.
 * @param {object} routes - The API routes to mount.
 */
app.use('/api/users', api_routes);


/**
 * Connects to a MongoDB database using the given URI and options.
 *
 * @param {string} uri - The URI of the MongoDB database to connect to.
 * @param {object} options - The options to use when connecting to the database.
 * @returns {Promise} A promise that resolves when the connection is successful, and rejects if there is an error.
 */
mongoose.connect(
  MONGO_URI,
  { useNewUrlParser: true,  useUnifiedTopology: true }
)
.then(() => console.log("MongoDB successfully connected"))
.catch(err => console.log(err));


/**
 * Express application
 * @typedef {Object} ExpressApp
 * @property {function} listen - Starts the server and listens for requests on a specified port
 */
app.listen(SERVER_PORT, () => console.log(`Server up and running on port ${SERVER_PORT} !`));