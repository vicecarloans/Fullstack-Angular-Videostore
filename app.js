const express = require('express');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
// const cleanAssets = require('./services/clean');
const helmet = require('helmet');
const keys = require("./config/keys");
const passport = require("passport")
const cors = require("cors");

// Database Migration
require("./models")();
// Intialize Passport Strategy
require('./services/passport');

const app = express();
app.use(helmet());
app.use(passport.initialize());
const corOptions = {
    origin: 'http://localhost:4200',
    credentials: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corOptions));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
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
    
    res.status(err.status || 500).json({error: err});       
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    // cleanAssets();
    console.log(`Server started on ${PORT}`);
});
