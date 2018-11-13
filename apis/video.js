const express = require('express');
const router = express.Router();
const fs = require('fs');
const mongoose = require('mongoose');
const VideoModel = mongoose.model('videos');
const multer = require('multer');
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
    const limit = req.query.limit || 15;
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
        res.json({video});
    }catch(e){
        next(e)
    }
    
});

/*
    GET /api/videos/:id/banner?imagepath=...
    Get banner by id of video
    Query Param:
    + id - id of current video to get banner
    Response: Image stream
*/
router.get('/:id/banner/',(req, res, next) => {
    console.log("Inside banner")
    const imagepath = req.query.imagepath;
    fs.createReadStream(imagepath).pipe(res);
})

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
router.post('/:id/reserve/', async (req, res, next) => {
    const customerId = req.body.customerId;
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

const storage = multer.diskStorage({
    destination: "public/uploads/"
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
        "image": "public/uploads/34e29f5d2c797987004f741b17fc89c1",
        "__v": 0
    }
*/


router.post('/', requireLogin, async (req,res,next) => {


    try{
        // Upload
        uploading(req, res, async (err) => {
            console.log(req.body)
            const {title, time, genre, rating, director, available} = req.body;
            const video = new VideoModel({
                title,
                time,
                genre,
                rating,
                director,
                image: req.file.path || '',
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
            const filepath = req.file ? req.file.path : '';
            const result = await VideoModel.findByIdAndUpdate(videoId, {
                $set: {
                    title: title,
                    time,
                    genre,
                    rating,
                    director,
                    image: filepath,
                    available,
                    modifiedAt: Date.now()
                }
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