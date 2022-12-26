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

app.use(express.urlencoded({extended:true}))

app.get('/', async (req, res) => {
    res.render('pages/login')
})

app.get('/user/:username', async (req, res) => {
    const {username} = req.params
    const userFound = await User.find({username: username})
    const user = userFound[0]
    console.log(user)
    res.render('pages/home', {user})
})

app.post('/home', async (req, res) => {
    console.log(req.body)
    const user = await User.find({username: req.body.username})
    console.log(user)
    console.log(user.length)
    //logic that compares un and un and pw and pw
    if(user.length< 1){
        //probably should handle this a little better
        res.redirect('/')
    } else {
        //do credentials comparions
        if(req.body.username === user[0].username && req.body.password ===user[0].password) {
            res.redirect(`user/${user[0].username}`);
        } else {
            res.redirect('/')
        }  
    }
})

app.get('/signup', async (req, res) => {
    res.render('pages/usercreate')
})

app.post('/new', async (req, res) => {
    const user = new User(req.body.user);
    const userQuery = await User.find({username: user.username})
    if (userQuery.length > 0) {
        //maybe add exception?
        console.log('ERROR: user exists')
        res.redirect('/signup')
    } else {
        console.log('user doesnt exist')
        console.log('creating user')
        await user.save();
        console.log('redirecting to home')
        res.redirect(`user/${user.username}`)
    }
})

const port = 3000
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})




