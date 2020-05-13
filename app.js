//jshint esversion:6
require('dotenv').config()
const express = require('express')
const app = express();
const ejs = require('ejs')
const bodyParser = require('body-parser')
const session  = require('express-session')
const mongoose = require('mongoose')
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended: true
}))
app.set('view engine', 'ejs')
app.use(session({
    secret: 'whatthisgottacontainasecret',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
mongoose.connect('mongodb://localhost:27017/secretsDB', {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.set('useCreateIndex', true);
const userSchema = new mongoose.Schema({
    email: String,
    password: String
})
userSchema.plugin(passportLocalMongoose)
const User = mongoose.model('User', userSchema)
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.listen(3000, () => {
    console.log(`We learning about Auth and Sec`)
})

app.get('/', (req, res) => {
    res.render('home')
})
app.get('/login', (req, res) => {
    res.render('login')
})
app.get('/register', (req, res) => {
    res.render('register')
})
app.post('/register', (req, res) => {
    User.register({username: req.body.username}, req.body.password, (err, user) => {
        
    })
})

app.post('/login', (req, res) => {

})

app.get('/logout', (req, res) => {
    res.redirect('/')
})
