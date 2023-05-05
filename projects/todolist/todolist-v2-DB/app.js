//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Since we were storing in array which will refresh on every restart we will be using mongoDB and deleted this array
// Starting Db connection
// replacing it with mongodb connect application link
mongoose.connect("mongodb+srv://admin-kishore:Test-kishAtlas4@cluster0.vduoleg.mongodb.net/todoListDB");

// creating a Schema
const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

//List of items
const item1 = new Item({
  name: "Welcome, do you art"
})
const item2 = new Item({
  name: "Hastle and surreal"
})
const item3 = new Item({
  name: "nice intimidating virtual"
})

const defaultItems = [item1, item2, item3];

// Creating lists within list i.e relational

const listSchema = {
  name: String,
  items: [itemsSchema]
}

const List = mongoose.model("List", listSchema);



app.get("/", function(req, res) {

  // We only need to send data when the foundItems array is empty so we will do doing it her

  Item.find().then(function (foundItems){

    if (foundItems.length === 0){
      
      Item.insertMany(defaultItems).then(function (){
        console.log("Successfullt added items to db");
      }).catch (function (err){
        console.log(err)
      });
      
      // this will redirect to "/" so the condition becomes false and jumps to else statement
      res.redirect("/");
    } else {
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
    // this will render all the db elements from the DB to the homepage which is in findItems
  }).catch(function (err){
    console.log(err);
  });
});

//dynamically creating pages
app.get("/:customName", function (req, res){
  const customName = _.capitalize(req.params.customName);

  List.findOne({name: customName}).then(function (foundList){
      if (!foundList){
        // Create new list
        const list = new List({
          name: customName,
          items: defaultItems
        });
        list.save();
        res.redirect("/"+customName);
      } else {
        // Show existig list
        res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
      }
    }
  ); 
  
  //we are using same DefaultItems array here to start with
  // const list = new List({
  //   name: customName,
  //   items: defaultItems
  // });
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list; //fetiching the value from button and its value here to add item to particular list

  const item = new Item ({
    name: itemName
  });

  if (listName === "Today"){
    item.save();
    // to add up the newly entered item it should be rendered on homepage so we should redirect it
    res.redirect("/");
  } else {
    List.findOne({name: listName}).then(function (foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/"+ listName);
    })
  }
  // this code doesnt allow us to add new item to the list
  // if (req.body.list === "Work") {
  //   workItems.push(item);
  //   res.redirect("/work");
  // } else {
  //   items.push(item);
  //   res.redirect("/");
  // }
});

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if(listName === "Today"){
  // Deleting based on clicked checkbox
  Item.findByIdAndRemove(checkedItemId).then(function(){
    console.log("Successfully deleted the checked item");
  }).catch(function (err){
    console.log(err);
  })
  res.redirect("/");
  } else {
    console.log(req.body.checkedItemId);
    // To loop thorought documnet and array we can integrate "Model.findOneAndUpdate()" by mongoosejs and mongodb's $pull
    // https://www.mongodb.com/docs/v6.0/reference/operator/update/pull/#-pull
    
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}).then(function (){
        res.redirect("/"+ listName);
    });
  }
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
