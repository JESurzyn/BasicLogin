const express = require('express');
const app = express();
const port = 3000
const mongoose = require('mongoose');
const path = require('path');
const User = require('../models/user');

mongoose.connect('mongodb://localhost:27017/usersForLoginApp')
    .then(()=> {
        console.log("MONGO DB CONNECTION OPEN")
    })
    .catch(e => {
        console.log('MONGO CONNECTION FAILED!!!')
        console.log(e);
    })

