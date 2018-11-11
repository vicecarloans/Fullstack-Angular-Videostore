const mongoose = require("mongoose");
const keys = require("../config/keys");

module.exports = () => {
    require("./AdminSchema");
    require("./CustomerSchema");
    require("./VideoSchema");
    mongoose.connect(keys.mongoURI);
    mongoose.connection.on('error', error => console.log(error) );    
}
