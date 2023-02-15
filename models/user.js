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

//middleware
userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12)
    next();
})

userSchema.statics.findAndValidate = async function(username, password) {
    const foundUser = await this.findOne({username});
    const isValid = await bcrypt.compare(password, foundUser.password);
    return isValid ? foundUser : false;
}

//define model
const User = mongoose.model('User', userSchema);

module.exports = User;