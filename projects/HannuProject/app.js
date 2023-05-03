const mongoose = require('mongoose');

const fruitSchema = new mongoose.Schema({
    name: String,
    price: {
        type: Number,
        min: 1,
        max: 100
    },
    rating: Number,
    review: String
});

const Fruit = mongoose.model('Fruit', fruitSchema);

const fruit = new Fruit({
    name: 'apple',
    // inbuilt validation 
    price: 30,
    rating: 9,
    review: 'Kept doctor away'
});

const banana = new Fruit({
    name: 'banana',
    price: 15,
    rating: 9.5,
    review: 'Digestion'
});

const grape = new Fruit({
    name: 'grape',
    price: 45,
    rating: 9,
    review: 'green as green'
});

const mango = new Fruit({
    name: 'mango',
    price: 45,
    rating: 9.6,
    review: 'King'
});

const personSchema = new mongoose.Schema({
    name: String,
    Age: Number,
    // embeding other documents within the db/relation 
    favoriteFruit: fruitSchema
});
const Person = mongoose.model('Person', personSchema);

const pine = new Fruit({
    name: "pineApple",
    price: 60,
    rating: 9.6,
    review: "Sweet"
})
const person = new Person({
    name: "Hara",
    Age: 8,
    favoriteFruit: mango
});

const person1 = new Person({
    name: "Courtney",
    Age: 23,
    favoriteFruit: pine
})

initial();
function initial (){
    if (Fruit.name == 'apple'){
        mongoose.connect("mongodb://127.0.0.1:27017/fruitDB");
    } else {
        mongoose.connect("mongodb://127.0.0.1:27017/peopleDB");
    }
    console.log("running the server");  
    return 'done.';
};

// Fruit.insertMany().then([banana, grape, mango], function(err, docs){
//     if (err) {
//         console.log(err);
//     } else {
//         console.log('Saved successfully');
//     }
// });

Person.insertMany().then([person, person1], function(err, docs){
    if (err) {
        console.log(err);
    } else {
        console.log('Saved successfully');
    }
});

person.save(); person1.save();

// fruit.save();
//The usage of callback functions has been deprecated in Mongoose 7.x. we need to use below method to get the data/collection from db

//Fruit.updateOne({_id:"6452a7444b3616c64fe0bb25"}, {name: "Pomogranate"});

Fruit.find().then(function (err, fruits){
    if (err){
        console.log(err);
    } else {
        mongoose.connection.close();
        fruits.forEach(function(fruit){
            console.log(Fruit.price);
        });
        mongoose.connection.close();
    }
});

Fruit.deleteMany({})