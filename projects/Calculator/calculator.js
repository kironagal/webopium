const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));

// app.get("/", function(req, res){
//     res.sendFile(__dirname + "/index.html");
// });

// app.post("/", function(req, res){
//     var n1 = Number(req.body.num1);
//     var n2 = Number(req.body.num2);
//     var a = n1 + n2;
//     var s = n1 - n2;
//     var m = n1 * n2;
//     var d = n1 / n2;
//     res.send("DMAS results Addition "+ a + " Subtraction "+ s + " Multiplication "+ m + " Division " + d); 
// });

app.get("/", function(req, res){
    res.sendFile(__dirname +"/bmiCalculator.html");
});

app.post("/", function(req, res){
    var w = parseFloat(req.body.weight);
    var h = parseFloat(req.body.height); 

    var bmi = w / Math.pow(2,h);
    res.send("Your BMI is "+ bmi);
});

app.listen(port, function(){
    console.log("server started listining");
});