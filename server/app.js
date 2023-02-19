//packages
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
// const methodOverride = require('method-override');

//models
const User = require('../models/user');

//db
mongoose.connect('mongodb://localhost:27017/usersForLoginApp2')
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
app.use(session({secret:'notagoodsecret'}))
app.use(flash());
app.use((req, res, next) => { //really should clean this up and make iterable
    res.locals.errors = req.flash('alreadyExists');
    res.locals.errors2 = req.flash('authError');
    next();
})

//login middleware
const requireLogin = (req, res, next) => {
    if(!req.session.user_id) {
        return res.redirect('/')
    }
    next();
}


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



app.get('/user/:username', requireLogin, async (req, res) => {
    const {username} = req.params
    const userFound = await User.find({username: username})
    const user = userFound[0]
    console.log(user)
    res.render('pages/home', {user})
})

//old method before user model statics
// app.post('/home', async (req, res) => {
//     console.log(req.body)
//     const user = await User.find({username: req.body.username})
//     console.log(user)
//     console.log(user.length)
//     //logic that compares un and un and pw and pw
//     if(user.length< 1){
//         //probably should handle this a little better
//         res.redirect('/noaccount')
//     } else {
//         //do credentials comparions
//         if(req.body.username === user[0].username && req.body.password ===user[0].password) {
//             req.session.user_id = user[0]._id;
//             res.redirect(`user/${user[0].username}`);
//         } else {
//             res.redirect('/authcomboerror')
//         }  
//     }
// })
app.post('/home', async (req, res) => {
    const {username, password} = req.body;
    //logic that compares un and un and pw and pw
    const foundUser = await User.findAndValidate(username, password);
    if(foundUser) {
        req.session.user_id = foundUser._id;
        res.redirect(`/user/${username}`)
    } else {
        // res.redirect('/autherror')
        req.flash('authError', 'Incorrect Username Password Combination')
        res.redirect('/')
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
        req.flash('alreadyExists', 'User Already Exists')
        // res.redirect('/alreadyexists')
        res.redirect('/signup')
    } else {
        console.log('user doesnt exist')
        console.log('creating user')
        await user.save();
        //dropping in user session
        req.session.user_id = user._id
        console.log('redirecting to home')
        res.redirect(`user/${user.username}`)
    }
    //     console.log(user)
    // }
})

app.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/')
})

const port = 3000
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})




