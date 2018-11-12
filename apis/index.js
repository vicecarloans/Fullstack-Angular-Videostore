const express = require('express');
const api = express.Router();
const userRoutes = require('./user');
const videoRoutes = require('./video');
const customerRoutes = require('./customer');

api.use('/user',userRoutes);
api.use('/videos',videoRoutes);
api.use('/customers', customerRoutes);
module.exports = api;