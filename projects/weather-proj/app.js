const express = require('express');
const https = require('https');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    //Place here
    res.sendFile(__dirname+ "/index.html");
});

app.post("/", function(req, res){
const lat = req.body.lat;
const lon = req.body.lon;
const unit = req.body.unit;
const apiKey = "6f859c55c7f3c3ca2b78f9e36816a647";
const url = "https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&units="+unit+"&appid="+apiKey;

https.get(url, function(response){
    console.log(response.statusCode);
    response.on('data', function(data){
        weathData = JSON.parse(data);
        console.log(weathData.weather);
        res.write("<p> The Weather is currently "+ weathData.weather[0].description + "</p>")
        res.write("<h1>The temperature in "+ weathData.name +" is " + weathData.main.temp + " degree celcius</h1>");
        const imgURL = "https://openweathermap.org/img/wn/"+ weathData.weather[0].icon + "@2x.png";
        res.write("<img src = "+ imgURL+ "></img>");
        res.send();
    })
})
//12.311639689873278, 76.65594108474738 name

})

app.listen(3000, function(){
    console.log("server listing on port 3000");
});