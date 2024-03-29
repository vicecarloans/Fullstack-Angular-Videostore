const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const CustomerModel = mongoose.model('customers');
const multer = require('multer');
const cloudinary = require("cloudinary");
const keys = require("../config/keys");
const cloudinaryStorage = require('multer-storage-cloudinary');

const requireLogin = require('../middlewares/requireLogin');



/*
    GET /api/customers?offset=...&limit=...
    Get all the list of customers with offset and limit for pagination
    Query Params:
    + offset: current page. Default: 0
    + limit: Maximum records to fetch. Default: 15
    Response: 
    {
        customers: [customer],
        offset: current page,
        count: Number of all records
    }
*/
router.get('/', requireLogin, async (req, res, next) => {
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 50;
    try{
        const customers = await CustomerModel.find()
                                        .limit(limit)
                                        .skip(offset*limit)
                                        .sort({firstName: 'asc'})
                                        .exec();
        const count = await CustomerModel.count().exec();
        res.json({
            customers,
            offset,
            count     
        });
    }catch(e){
        next(e);
    }
    
});

/*
    GET /api/customers/info/:id
    Get customer by id 
    Url Param:
    + id - id of specific customer to find
    Response: 
    {
        customer: {
            firstName,
            lastName,
            address,
            city,
            phoneNumber,
            status
        }
    }
*/
router.get('/info/:id', requireLogin, async (req, res, next) => {
    try{
        const customerId = req.params.id;
        const customer = await CustomerModel.findById(customerId);
        res.json(customer);
    }catch(e){
        next(e);
    }
});
/*
    GET /api/customers/names/
    Get all names for dropdown box
    Response:
    {
        customers: [
            {   
                _id: ...,
                firstName: ...,
                lastName: ...,
            }
        ]
    }
*/
router.get('/names', async (req, res, next)  => {
    try {
        const customers = await CustomerModel.find()
                                             .select('firstName lastName')
                                             .exec();
        res.json({customers});
    }catch(e){
        next(e);
    }
});
/*
    POST /api/customers/
    Create new customer
    JSON body:
    {
        firstName,
        lastName,
        address,
        city,
        phoneNumber,
        status
    }
    Response:
    {
        result: {
            customer: {...}
        }
    }
*/
router.post('/', requireLogin, async (req, res, next) => {
    console.log(req.body);
    try{
        const {firstName, lastName, address, city, phoneNumber, status} = req.body
        const customer = new CustomerModel({
            firstName,
            lastName,
            address,
            city,
            phoneNumber,
            status
        })
        const result = await customer.save();
        res.json({result});
    }catch(e){
        next(e);
    }
});

/*
    PUT /api/customers/:id
    Update customer by id
    Url Param:
    id - Customer id to update
    Response: Updated version of customer
*/

router.put('/:id', requireLogin, async (req, res, next) => {
    try {
        const {firstName, lastName, address, city, phoneNumber, status} = req.body
        const customerId = req.params.id;
        const result = await CustomerModel.findByIdAndUpdate(customerId, {
            $set: {
                firstName,
                lastName,
                address,
                city,
                phoneNumber,
                status,
                modifiedAt: Date.now()
            }
        }, {new: true})
        res.json({result});
    }catch(e){
        next(e);
    }
});

/*
    DELETE /api/customers/:id
    Delete customer by id
    Url Param:
    id - Customer id to delete
    Response: 
    + status: 1 for everything going smoothly, error will be thrown
*/
router.delete('/:id', requireLogin, async (req, res, next) => {
    try {
        const customerId = req.params.id;
        await CustomerModel.findByIdAndDelete(customerId);
        res.json({
            status: 1
        })
    } catch(e){
        next(e);
    }
});

module.exports = router;