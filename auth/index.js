const express = require('express');
const passport = require('passport');
const keys = require('../config/keys');
const jwt = require('jsonwebtoken');

const router = express.Router();


router.post('/login', async (req, res, next) => {
    passport.authenticate('login', async (error, user, info) => {
        if(error){
            return next(error);
        }
        if(!user){
            const error = new Error(info);
            error.status = 400;
            return next(error);
        }
        req.login(user, {session: false}, async (err) => {
            if(err) return next(err);
            const body = {email: user.email}
            const jwtToken = jwt.sign({user: body}, keys.JWT_KEY, {
                expiresIn: '7d',
                subject: user._id.toString()
            });
            res.cookie("access_token", jwtToken, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                encode: String
            });
            return res.json({status: 1})
        })
    })(req, res, next);
})

router.get('/logout', (req, res) => {
    res.cookie("access_token", null, {
        maxAge: 0
    })
    res.json({status: 1})
});

module.exports = router;