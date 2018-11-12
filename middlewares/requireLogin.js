
const passport = require('passport');
module.exports = (req, res, next) => {
    passport.authenticate('jwt',{session: false}, (error, token, info) => {
        if(error){
            next(error);
        }
        if(!token){
            const error = new Error("Unauthorized");
            error.status = 401; 
            next(error);
        }
        req.token = token;
        next();
    })(req, res,next);
}