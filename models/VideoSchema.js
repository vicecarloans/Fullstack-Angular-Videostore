const mongoose = require("mongoose");
const {Schema} = mongoose;

const VideoSchema = new Schema({
    title: String,
    time: Number,
    genre: String,
    rating: Number,
    director: String,
    image: String,
    _customerId: {type: Schema.Types.ObjectId, ref: 'customers'},
    available: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type:Date,
        default: Date.now()
    },
    modifiedAt: {
        type:Date,
        default: Date.now()
    }
})
VideoSchema.pre(/update/, function(next){
    const modifiedDate = Date.now();
    this.modifiedAt = modifiedDate;
    next();
})


const VideoModel = mongoose.model("videos", VideoSchema);
