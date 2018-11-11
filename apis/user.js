const express = require('express');
const mongoose = require('mongoose');
const Admin = mongoose.model('admins')
const authorize = require('../middlewares/login')
const router = express.Router();

router.get('/current', authorize, (req, res) => {
    res.send(req.user);
});

router.post('/add', async (req,res, next) => {
    const admin = new Admin({email: 'admin@root.com', password: 'root'});
    try{
        await admin.save();
        res.send({status: 1})
    }
    catch(e){
        next(e);
    }
})

module.exports = router;