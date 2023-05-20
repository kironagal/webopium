require('dotenv').config(); // dotenv to load .env files
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose'); //since this package require "passport-local" we are not requiring it here
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');

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
    password: String,
    googleId: String, //we can validate whether the person already exists
    secret: String // this will save user secret
});

//Using Plugin Passport-Local Mongoose
userSchema.plugin(passportLocalMongoose);
//mongoose-findorcreate 
userSchema.plugin(findOrCreate);

const User = mongoose.model('User', userSchema);

//Simplified Passport/Passport-Local Configuration
passport.use(User.createStrategy());

//Replacing the previous as it was giving error Failed to serialize user into session
passport.serializeUser(function(user, cb){
    process.nextTick(function(){
        return cb(null, {
            id: user.id, 
            username: user.username,
        });
    });
});

passport.deserializeUser(function( user, cb){
    process.nextTick(function() {
        return cb(null, user);
    });
})

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    // google+ api deprecation
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
    },
    function(accessToken, refreshToken, profile, cb) {
        console.log(profile);
        // findorcreate is a psuedo/made-up function install mongoose-findorcreate 
        User.findOrCreate({ googleId: profile.id}, function (err, user){
            return cb (err, user);
        });
    }
));

app.get("/", function (req, res){
    res.render('home');
});

//Adding /auth/google since it is refered from register.ejs
app.get('/auth/google', passport.authenticate('google', { scope: ['profile']})
);

// authnticatin after google authenticates redirects to this path from google
app.get('/auth/google/secrets', passport.authenticate('google',{ failureRedirect: '/login'}), 
    function(req, res){ res.redirect('/secrets')});

app.get("/login", function (req, res){
    res.render('login');
});

app.get("/register", function (req, res){
    res.render('register');
});

app.get("/secrets", function (req, res){
// since it will be routed only after the authtntication we will be removing below validation part and add new submitted secrets
// here we will be quering the secret is not null using mongoose
    User.find({"secret": {$ne: null}}).then(function(foundUsers){
        if (foundUsers){
            res.render("secrets", {usersWithSecret: foundUsers});
        }
    }).catch(function(err){
        if(err){console.log(err)};
    });
});

app.get("/submit", function (req, res){
    // we will check wheather the user is logged in and then we will render the page
    if (req.isAuthenticated()){
        res.render("submit");
    } else {
        res.redirect("/login");
    }
});

app.post("/submit", function (req, res){
    const submittedSecret = req.body.secret;
    //passport will save user id to req 
    console.log(req.user.id);
    User.findById(req.user.id). then(function (foundUser){
        if (foundUser){
            foundUser.secret = submittedSecret;
            foundUser.save();
            res.redirect("/secrets");
        }}).catch(function(err){
            console.log(err);
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

app.listen(3000, function(){
    console.log("Server listening on port 3000");
});