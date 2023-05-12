const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require('cors');
const db = require("./configurations/keys").mongoURI;
const morgan = require('morgan');
const api_routes = require("./Routes/api");


const app = express();

// Bodyparser middleware
app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

app.use(cors());
app.use(morgan('dev'));

app.use('/api/users', api_routes);
// DB Config

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true,  useUnifiedTopology: true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());
const errorLogger = (request, response, next) => {
  console.log('Logged');
  next()
}
app.use(errorLogger);

// Passport config
// require("./config/passport")(passport);

// Routes
// app.use("/api/users", users);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up and running on port ${port} !`));