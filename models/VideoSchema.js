const mongoose = require("mongoose");
const {Schema} = mongoose;

const VideoSchema = new Schema({
    title: String,
    time: Number,
    genre: String,
    rating: Number,
    director: String,
    _customer: {type: Schema.Types.ObjectId, ref: 'customers'},
    status: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type:Date,
        default: Date.now()
    },
    modifiedat: {
        type:Date,
        default: Date.now()
    }
})
VideoSchema.pre(/update/, function(next){
    const modifiedDate = Date.now();
    this.modifiedAt = modifiedDate;
    next();
})

VideoSchema.method({
    create: function(info){
        
    },
    updateById: function(id, video){

    },
    deleteById: function(id){

    },
    listAll: function(offset = 0, limit = 20){

    }
})

const VideoModel = mongoose.model("videos", VideoSchema);
