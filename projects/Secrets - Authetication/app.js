require('dotenv').config(); // dotenv to load .env files
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose'); //since this package require "passport-local" we are not requiring it here
const GoogleStrategy = require('passport-google-oauth20')

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

//adding express-session code
app.use(session({
    secret: 'OfficeHomeStudent',
    resave: false,
    saveUninitialized: false
}));

//Initalizing passport and passport session (middleware)
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser: true});

// Defining your schema as per encryption
const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

//Using Plugin Passport-Local Mongoose
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

//Simplified Passport/Passport-Local Configuration
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser()); //creats cookies
passport.deserializeUser(User.deserializeUser()); // destroys cookies

app.get("/", function (req, res){
    res.render('home');
});

app.get("/login", function (req, res){
    res.render('login');
});

app.get("/register", function (req, res){
    res.render('register');
});

app.get("/secrets", function (req, res){
    if (req.isAuthenticated()){
        res.render("secrets");
    } else {
        res.redirect("/register");
    }
});

//from passport-local-mongoose package
app.post("/register", function(req, res){
    User.register({username:req.body.username}, req.body.password, function (err, user){
        if (err){
            res.redirect("/register");
        } else {
            passport.authenticate('local') (req, res, function(){
                res.redirect("/secrets");
            });
        }
    });
});

//Using login from passport https://www.passportjs.org/concepts/authentication/login/
app.post("/login", function (req, res){
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    req.login(user, function(err){
        if (err){
            console.log(err);
            res.send(err);
        }else{
            passport.authenticate('local') (req, res, function(){
                res.redirect("/secrets"); 
            });
        }
    });
});

//Using logout from passport https://www.passportjs.org/concepts/authentication/logout/
app.get("/logout", function (req, res, next){
    req.logOut(function (err){
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });   
});

// This part isn't working method not correct
// app.post("/logout", function (req, res, next){
//     req.logOut(function (err){
//         if (err) {
//             return next(err);
//         }
//         res.redirect("/");
//     });
// });

app.listen(3000, function(){
    console.log("Server listening on port 3000");
});