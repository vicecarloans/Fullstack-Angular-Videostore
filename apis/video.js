const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const VideoModel = mongoose.model('videos');
const multer = require('multer');
const cloudinary = require("cloudinary");
const keys = require("../config/keys");
const cloudinaryStorage = require("multer-storage-cloudinary");

const requireLogin = require('../middlewares/requireLogin');


/*
    GET /api/videos?offset=...&limit=...
    Get video listing
    Query: 
    + offset - offset of pagination. Default: 0
    + limit - limit of video records. Default: 15
    Response: 
    {
        videos: Array of videos,
        offset: Current page,
        count: max records
    }       
*/
router.get('/', async (req, res,next) => {
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 50;
    try{
        const videos = await VideoModel.find()
                                        .limit(limit)
                                        .skip(offset*5)
                                        .sort({title: 'asc'})
                                        .exec();
        const count = await VideoModel.count().exec();

        res.json({videos, offset, count});
    }catch(e){
        next(e);
    }
});
/*
    GET /api/videos/:id/
    Get video by id
    Url Params:
    + id - param of current to get specific record id
    Response:
    {
        video: Single video object
    }
*/
router.get('/:id', async (req, res, next) => {
    const videoId = req.params.id;
    try{
        const video = await VideoModel.findById(videoId);
        res.json(video);
    }catch(e){
        next(e)
    }
    
});

/*
    POST /api/videos/:id/reserve/
    Reserve Video for specific customer
    Accept: application/json
    Url Params:
    + id - id of current video to reserve
    JSON body:
    {
        customerId: id of customer to reserve
    }
    Response:
    New object of video
*/
router.get('/:id/reserve/:customerId', async (req, res, next) => {
    const customerId = req.params.customerId;
    const videoId = req.params.id;
    try{
        const result = await VideoModel.findByIdAndUpdate(videoId, {
            $set: {
                _customerId: customerId,
                available: false
            }
        },{new: true});
        res.json({result});
    }catch(e){
        next(e)
    }
    
});


cloudinary.config({
    cloud_name: keys.CLOUDINARY_NAME,
    api_key: keys.CLOUDINARY_API,
    api_secret: keys.CLOUDINARY_SECRET
});
const storage = cloudinaryStorage({
    cloudinary,
    folder: "public",
    allowedFormats: ["jpg","png","jpeg"],
    transformation: [{ width: 500, height: 500, crop: "limit" }]
})
const uploading = multer({storage}).single('banner');
/*
    POST /api/videos/
    Create new video
    Accept: multipart/form-data
    Field names:
    + title
    + time
    + genre
    + rating
    + director
    + banner: Image file
    + available: true/false
    Response Example:
    {
        "available": true,
        "createdAt": "2018-11-12T04:33:13.581Z",
        "modifiedAt": "2018-11-12T04:33:13.581Z",
        "_id": "5be902e59524500f3f2a8c42",
        "title": "Lord of the Rings",
        "time": 120,
        "genre": "Fantasy",
        "rating": 5,
        "director": "J.K.K.Rowling",
        "image": "http://cloudinary....",
        "__v": 0
    }
*/


router.post('/', requireLogin, async (req,res,next) => {
    try{
        // Upload
        uploading(req, res, async (err) => {
            const {title, time, genre, rating, director, available} = req.body;
          
            const video = new VideoModel({
                title,
                time,
                genre,
                rating,
                director,
                image: req.file.url || '',
                available
            })
            const result = await video.save();
            
            res.json({result});
        });
        
    }catch(e){
        next(e);
    }
})

/*
    PUT /api/videos/:id
    Update by id

*/
router.put('/:id', requireLogin, async (req, res, next) => {
    try{
        uploading(req, res, async (err) => {
            const videoId = req.params.id;
            const {title, time, genre, rating, director, available} = req.body;
            const filepath = req.file ? req.file.url : '';
            const updateBody = {
                title,
                time,
                genre,
                rating,
                director,
                available,
                _customerId: available && null,
                modifiedAt: Date.now()
            }
            if(filepath){
                updateBody.image = filepath
            }
            const result = await VideoModel.findByIdAndUpdate(videoId, {
                $set: updateBody
            }, {new: true})
            res.json({result});
        });
    }catch(e){
        next(e)
    }
});

/*
    DELETE /api/videos/:id
    Delete video by id
*/
router.delete('/:id', requireLogin, async (req, res, next) => {
    const videoId = req.params.id;
    try{
        await VideoModel.findByIdAndDelete(videoId);
        res.json({status: 1});
    }catch(e){
        next(e);
    }
});


module.exports = router;