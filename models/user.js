const mongoose = require('mongoose');

//define schema
const userSchema = new mongoose.Schema({
    username: {
        type:String,
        required: true
    },
    password: {
        type:String,
        required:true
    },
    firstName: {
        type:String,
        required:true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
})

//define model
const User = mongoose.model('User', userSchema);

module.exports = User;