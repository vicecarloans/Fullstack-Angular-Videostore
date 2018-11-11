const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const {Schema} = mongoose;

const AdminSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type:String,
        required: true
    },
})

AdminSchema.pre('save', async function(next){
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
})

AdminSchema.method({
    validatePassword: async function(password){
        const compare = await bcrypt.compare(password, this.password);
        return compare;
    }
})

const AdminModel = mongoose.model("admins", AdminSchema);
module.exports = AdminModel;