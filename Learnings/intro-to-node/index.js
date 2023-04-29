//const fs = require('fs');
// // fs.copyFileSync('file1.txt', 'file2.txt');
// fs.unlink('file1.txt', (err)=> {
//     if(err) throw err;
//     console.log('pathfile is deleted');
// });

const superheroes = require('superheroes');
var randSupHero = superheroes.random();
console.log(randSupHero);

const superVillains = require('supervillains');
var randSupVill = superVillains.random();
console.log(randSupVill);