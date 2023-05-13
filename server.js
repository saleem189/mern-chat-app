const express = require("express");
const session = require('express-session');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require('cors');
const db = require("./configurations/keys").mongoURI;
const morgan = require('morgan');
const api_routes = require("./Routes/auth_routes");
const cookieParser = require('cookie-parser');


const app = express();

// Bodyparser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));
// Passport middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  // cookie: { secure: true }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

// Passport config
require("./configurations/passport")(passport);

app.use('/api/users', api_routes);

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true,  useUnifiedTopology: true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

// Routes
// app.use("/api/users", users);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up and running on port ${port} !`));