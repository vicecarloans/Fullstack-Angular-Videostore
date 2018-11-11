const mongoose = require("mongoose");
const {Schema} = mongoose

const CustomerSchema = new Schema({
    firstName: String,
    lastName: String,
    address:String,
    city:String,
    phoneNumber: String,
    status: Boolean,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    modifiedAt: {
        type: Date,
        default: Date.now()
    }
})
CustomerSchema.pre(/update/, function(next){
    const modifiedDate = Date.now();
    this.modifiedAt = modifiedDate;
    next();
})
CustomerSchema.method({
    listAll : function(offset = 0, limit = 20){

    },
    updateById: function(id, customer){

    },
    deleteById: function(id){

    },
    create: function(info){

    }
})

const CustomerModel = mongoose.model("customers", CustomerSchema);
