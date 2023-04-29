const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');  //place it only after express initiation else gives error

app.get("/", function(req, res){

    const daysOfWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    var today = new Date();
    var day = "";
    if (today.getDay() === 6 || today.getDay() === 0){
        day = "Weekend";
    } else {
        day = "weekday";
    }
    let weekDay = daysOfWeek[today.getDay()];
    res.render('list', {
        kindOfDay:day,
        week: weekDay
    });
});


app.listen(3000, function(){
    console.log("server listing on port 3000")
})