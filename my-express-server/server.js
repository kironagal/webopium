const express = require('express');
const app = express();

app.get("/", function(request, response){
    response.send("<h1>Hello there, first HTML tag</h1>");
});

app.get("/commute", function(req, res){
    res.send("You are hitting commute tab");
});

app.get("/about", function(req, res){
    res.send("My name is Kirongal hord");
});

app.get("/extra", function(req, res){
    res.send(
        "<li>extra1</li><li>extra2</li><li>extra3</li>"
    )
});

app.listen(3000, function (){
    console.log("server started listening on port 3000");
});