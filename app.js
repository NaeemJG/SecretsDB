//jshint esversion:6
require('dotenv').config()
const express = require('express')
const app = express();
const ejs = require('ejs')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption')
app.use(express.static('public'))
app.set('view engine', 'ejs')
mongoose.connect('mongodb://localhost:27017/secretsDB', {useNewUrlParser: true, useUnifiedTopology: true})
const userSchema = new mongoose.Schema({
    email: String,
    password: String
})
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});
const User = mongoose.model('User', userSchema)
app.listen(3000, () => {
    console.log(`We learning about Auth and Sec`)
})
app.use(bodyParser.urlencoded({
    extended: true
}))
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
    const user = new User({
        email: req.body.username,
        password: req.body.password
    })
    user.save((err) => {
        if (!err) {
            res.render('secrets')
        } else {
            res.send(`Something went wrong...${err}`)
        }
    });
    // res.redirect('/login')
})

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, (err, result) => {
        if(!err) {
            if(result) {
                if (result.password === password) {
                    res.render('secrets')
                }
            }
        } else {
            res.send(`Something went wrong...${err}`)
        }
    })
})

app.get('/logout', (req, res) => {
    res.redirect('/')
})
