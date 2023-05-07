const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded ({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

// To reduce redundancy we using app.route() of express JS
///////////////////////////////////Start of Request targeting all the articles////////////////////////////////////////
app.route("/articles")

.get(function (req, res){
    Article.find({}).then(function(foundArticles){
        res.send(foundArticles);
    }).catch(function(err){
        res.send(err);
    });
})

.post(function (req, res){
    const postTitle = req.body.title;
    const postContent = req.body.content;

    const newArticle = new Article ({
        title : postTitle,
        content: postContent
    });
    newArticle.save().then(function (updated){
            res.send("Successfully added new file!");
        }).catch(function (err){
            res.send(err);
        });
})

.delete(function (req, res){
    //Deletes all
    Article.deleteMany({}).then(function (deleted){
        res.send("Deleted the articles data!");
    }).catch(function (err){
        res.send(err);
    });

    // Delete only one
    // Article.deleteOne({title: req.params.articleTitle}).then(function (deleted){
    //     res.send("Deleted the"+ postTitle +"data!");
    // }).catch(function (err){
    //     res.send(err);
    // });
});
///////////////////////////////////End of Request targeting all the articles//////////////////////////////////////////

///////////////////////////////////Start of Request targeting a specific article//////////////////////////////////////
app.route("/articles/:articleTitle")
.get(function (req, res){
    const getTitle = req.params.articleTitle
    Article.findOne({
        title: getTitle
    }).then(function (foundArticle){
        res.send(foundArticle);
    }).catch(function (err){
        //res.send(err);
        console.log("No Articles found matching the Article");
    });
})

.put(function(req, res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        ).then(function (updated){
            res.send("Successfully updated Article");
    }).catch(function(err){
        console.log(err);
        res.send("Data couldn't be updated");
    });
})

.patch(function(req, res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body}, // the requestor can send any key of the body to keep it dynamic we are using req.body & $set from mongodb
    ).then(function (updated){
            res.send("Successfully updated Article");
    }).catch(function(err){
        console.log(err);
        res.send("Data couldn't be updated");
    });
})

.delete(function (req, res){
    Article.deleteOne(
        {title: req.params.articleTitle},
    ).then(function (updated){
        res.send("Successfully deleted Article");
    }).catch(function(err){
        console.log(err);
        res.send("Data couldn't be deleted");
    });
});

///////////////////////////////////End of Request targeting a specific article////////////////////////////////////////
app.listen(3000, function(){
    console.log("Server started listining on port 3000")
});