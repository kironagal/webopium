require('dotenv').config(); // dotenv to load .env files
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption'); // https://www.npmjs.com/package/mongoose-encryption
const bcrypt = require('bcrypt'); // hashing with salting 
const saltRounds = 10;

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser: true});

// Defining your schema as per encryption
const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

const User = mongoose.model('User', userSchema);

app.get("/", function (req, res){
    res.render('home');
});

app.get("/login", function (req, res){
    res.render('login');
});

app.get("/register", function (req, res){
    res.render('register');
});

app.post("/register", function(req, res){
    // hashing with saltRounds and only passing it then to create user registration
    bcrypt.hash(req.body.password, saltRounds, function (err, hash){
        const newUser = new User ({
            email: req.body.username,
            password: hash
        });
        newUser.save().then(function(saved){
            res.render('secrets');
        }).catch(function(err){
            console.log(err);
            res.render(err);
        })
    });
});

app.post("/login", function(req, res){
    const userName = req.body.username;
    const password = req.body.password;

    User.findOne({email: userName}).then(function (foundUser){
        if (foundUser){
            bcrypt.compare(password, foundUser.password, function (err, result){
                if (result === true){
                    res.render("secrets");
                }
            });
        }
    }).catch(function(err){
        console.log(err);
        res.render(err);
    });
});



app.listen(3000, function(){
    console.log("Server listening on port 3000");
});