const mongoose = require('mongoose');
const User = require('./models/user');

mongoose.connect('mongodb://localhost:27017/usersForLoginApp')
    .then(()=> {
        console.log('MONGO CONNECTION OPEN')
    })
    .catch(e=>{
        console.log('MONGO CONNECTION FAILED!')
        console.log(e);
    })

const seedUsers = [
    {
        username: 'sample1_un',
        password: 'sample1_pw',
        firstName: 'sample1_first',
        lastName: 'sample1_last',
        email: 'sample1_email'
    },
    {
        username: 'sample2_un',
        password: 'sample2_pw',
        firstName: 'sample2_first',
        lastName: 'sample2_last',
        email: 'sample2_email'
    }
]

User.insertMany(seedUsers)
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })