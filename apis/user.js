const express = require('express');
const mongoose = require('mongoose');
const Admin = mongoose.model('admins')
const authorize = require('../middlewares/requireLogin')
const router = express.Router();

router.get('/', authorize, (req, res) => {
    res.send(req.token);
});


module.exports = router;