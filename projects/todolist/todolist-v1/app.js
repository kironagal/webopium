const express = require('express');
const bodyParser = require('body-parser');
const { render } = require('ejs');
const date = require(__dirname+'/date.js');

const app = express();

// Avoid using var for declaration use let instead
// In Array decalred as constant is it possible to push data even though it is constant but it cannot be reassigned to new variable
// we can vary the values inside an array declared as constant but not the constant
const nLists = ["Workout","Cooking","Working","Recreational"];
const workItems = [];

app.set('view engine', 'ejs');  //place it only after express initiation else gives error

app.use(bodyParser.urlencoded({extended: true}));

// define a public folder and add static files, Ex: css, javascript, 
// express only see to public(Ex) folders to render on loading website as the command says static
app.use(express.static("public"));

app.get("/", function(req, res){

    //sent day logic to other date.js folder and fetched it from modules.exports process
    const day = date.getDate(); // renders date from module, changed let to const while refactoring
    //let day = date.getDay(); // renders day from module

    res.render('list', {
        ListTitle: day,
        newList: nLists
    })
    
});

// lot of work around here eventually localhost:3000/work is hit, base on the path the list will be created on that particular
// page, in list.ejs, the button component had name="List", in this if condition it will check the req.body.List is it is from 
// work tab/page, this logic helps in creating list in that page only, if not he "Work" tab the req.body.List will be the
// weekdays from Listtitle

app.post("/", function(req, res){
    nList = req.body.newItem;

    if (req.body.List === "Work"){
        workItem = req.body.newItem;
        workItems.push(workItem);
        res.redirect("/work");
    } else {
        nLists.push(nList);
        res.redirect("/");
    }
});

// if the user makes call to "/work" route this helps in doing it
app.get("/work", function(req, res){
    res.render('list', {
        ListTitle: "Work List",
        newList: workItems
    });
});

//just to test EJS layouts by creating new /about route
app.get("/about", function(req, res){
    res.render("about");
});

app.listen(3000, function(){
    console.log("server listing on port 3000")
})