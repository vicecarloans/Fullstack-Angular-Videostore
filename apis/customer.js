const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const CustomerModel = mongoose.model("customers");

module.exports = router;