const mongoose = require("mongoose");
const {Schema} = mongoose

const CustomerSchema = new Schema({
    firstName: String,
    lastName: String,
    address:String,
    city:String,
    phoneNumber: String,
    status: {type: Boolean, default: true},
    createdAt: {
        type: Date,
        default: Date.now()
    },
    modifiedAt: {
        type: Date,
        default: Date.now()
    }
})
CustomerSchema.pre(/^update/, function(next){
    const modifiedDate = Date.now();
    this.modifiedAt = modifiedDate;
    next();
})

const CustomerModel = mongoose.model("customers", CustomerSchema);
