const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const keys = require("../config/keys");
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const Admin = mongoose.model("admins");

passport.use('login', new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try{
        const user = await Admin.findOne({email});
        if (!user){
            return done(null, false, {message: 'Invalid email address'})
        }
        const validate = await user.validatePassword(password);
        if (!validate){
            return done(null, false, {message: 'Invalid password'});
        }
        return done(null, user);
    }catch(e){
        done(e);
    }
}))

const cookieExtractor = (req) => {
    if(req && req.cookies){
        return req.cookies["access_token"];
    }
    return null
}

passport.use(new JWTstrategy({
    secretOrKey: keys.JWT_KEY,
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor])
}, async (token, done) => {
    try {
        if(token){
            return done(null,token);
        }
        return done(null, false);
    }catch(e){
        done(e);
    }
}))

