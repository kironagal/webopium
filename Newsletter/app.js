const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req, res){
    res.sendFile(__dirname+"/signup.html");
})

app.post("/", function(req, res){

    const fName = req.body.FirstName;
    const lName = req.body.LastName;
    const email = req.body.email;

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: fName,
                LNAME: lName
            }
        }]
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us21.api.mailchimp.com/3.0/lists/31a06d7ade"; ///id copied from below /lists/{list_id}
    const options = {
        method: 'POST',
        auth: 'kish:94b459f51c27c064f8b6900a770c0c4c-us21a'
    };

    const request = https.request(url, options, function(response){
        if (response.statusCode == 200){
            res.sendFile(__dirname+ "/success.html");
        } else {
            res.sendFile(__dirname+ "/failure.html")
        }

        response.on('data', function(data){
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();

});

app.post("/failure", function(req, res){
    res.redirect("/");
});

// changing port from 3000/8080 to process.env.PORT because heroku automatically deplyes on a random available port
// "||" OR condition enables to listen either of the port 

app.listen(process.env.PORT || 3000, function(){
    console.log("server is listening");
});


//APIKey mailchimp
//94b459f51c27c064f8b6900a770c0c4c-us21

//List ID by mailchip
//31a06d7ade