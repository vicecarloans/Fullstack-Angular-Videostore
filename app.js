const express = require('express');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const keys = require("./config/keys");
const passport = require("passport")
const cors = require("cors");

// Database Migration
require("./models")();
// Intialize Passport Strategy
require('./services/passport');

const app = express();

app.use(passport.initialize());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser(keys.cookiePrivateKey, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
}))

// Registering Routes
const ApiRoutes = require('./apis');
const AuthRoutes = require('./auth');
app.use('/auth',AuthRoutes);
app.use('/api',ApiRoutes);


app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({ error : err });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
});
