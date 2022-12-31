//packages
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError')
const wrapAsync = require('./utils/wrapAsync') 
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


app.get('/', (req, res) => {
    res.render('pages/login')
})

app.get('/autherror', (req, res) => {
    res.render('pages/authcomboerror')
})

app.get('/noaccount', (req, res) => {
    res.render('pages/noaccount')
})

app.get('/alreadyexists', (req, res) => {
    res.render('pages/alreadyexists')
})



app.get('/user/:username', wrapAsync(async (req, res) => {
    const {username} = req.params
    const userFound = await User.find({username: username})
    const user = userFound[0]
    console.log(user)
    res.render('pages/home', {user})
}));

app.post('/home', wrapAsync(async (req, res) => {
    console.log(req.body)
    const user = await User.find({username: req.body.username})
    console.log(user)
    console.log(user.length)
    //logic that compares un and un and pw and pw
    if(user.length< 1){
        //probably should handle this a little better
        res.redirect('/noaccount')
    } else {
        //do credentials comparions
        if(req.body.username === user[0].username && req.body.password ===user[0].password) {
            res.redirect(`user/${user[0].username}`);
        } else {
            res.redirect('/authcomboerror')
        }  
    }
}));

app.get('/signup', wrapAsync(async (req, res) => {
    res.render('pages/usercreate')
}));

app.post('/new', wrapAsync(async (req, res) => {
    const user = new User(req.body.user);
    const userQuery = await User.find({username: user.username})
    if (userQuery.length > 0) {
        //maybe add exception?
        console.log('ERROR: user exists')
        res.redirect('/alreadyexists')
    } else {
        console.log('user doesnt exist')
        console.log('creating user')
        await user.save();
        console.log('redirecting to home')
        res.redirect(`user/${user.username}`)
    }
}));

//error handling for unrecognized routes
app.all('*', (req,res,next) => {
    next(new ExpressError('Page Not Found', 404))
})

// //basic error middleware, default messaging
app.use((err, req, res, next) =>{
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Oh No!! something went wrong';
    res.status(statusCode).render('error', {err})
});

const port = 3000
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})




