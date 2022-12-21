//packages
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
// const methodOverride = require('method-override');

//models
const User = require('../models/user');

//db
mongoose.connect('mongodb://localhost:27017/usersForLoginApp')
    .then(()=> {
        console.log("MONGO DB CONNECTION OPEN")
    })
    .catch(e => {
        console.log('MONGO CONNECTION FAILED!!!')
        console.log(e);
    })

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../client/views'))

app.get('/login', async (req, res) => {
    res.render('pages/login')
})

app.get('/usercreate', async (req, res) => {
    res.render('pages/usercreate')
})
app.get('/home', async (req, res) => {
    res.render('pages/home')
})


const port = 3000
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})




