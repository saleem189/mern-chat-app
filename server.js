const express = require("express");
const session = require('express-session');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require('cors');
const morgan = require('morgan');
const api_routes = require("./Routes/auth_routes");
const { MONGO_URI, SERVER_PORT } = require("./configurations/constants");

const app = express();

// Bodyparser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  // cookie: { secure: true }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport config
require("./configurations/passport")(passport);

// Routes
app.use('/api/users', api_routes);

// Connect to MongoDB
mongoose
  .connect(
    MONGO_URI,
    { useNewUrlParser: true,  useUnifiedTopology: true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

  // Listen for requests on port and start the server
app.listen(SERVER_PORT, () => console.log(`Server up and running on port ${SERVER_PORT} !`));