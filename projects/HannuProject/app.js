const { MongoClient } = require('mongodb');
// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'hannuDB';

async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const collection = db.collection('hannu');

// uncomment or comment necessary peice of code  
//   Insert a Document
  const insertResult = await collection.insertMany(
      [
          {
              name: 'apple',
              score: 9,
              review: 'Docter away'
          }, 
          { 
              name: 'banana',
              score: 9.5,
              review: 'Helps Digestion'
          }, 
          {
              name: 'grape',
              score: 9,
              review: 'Needs seeds'
          }
      ]
      );
    console.log('Inserted documents =>', insertResult); 

    // Find All Documents
    const findResult = await collection.find({}).toArray();
    console.log('Found documents =>', findResult);

    // Find Documents with a Query Filter
    const filteredDocs = await collection.find(
        {
            name: 'apple',
            score: 9,
            review: 'Docter away'
        },
    ).toArray();
    console.log('Found documents filtered by fruit name =>', filteredDocs);

    // Update a document
    const updateResult = await collection.updateOne(
        {
            name: 'apple',
            score: 9,
            review: 'Docter away'
        },
         { $set: { name: 'sebu' } });
    console.log('Updated documents =>', updateResult);

    // Remove a document
    const deleteResult = await collection.deleteMany(
        {
            name: 'apple',
            score: 9,
            review: 'Docter away'
          },
          {
            name: 'banana',
            score: 9.5,
            review: 'Helps Digestion'
          },
          {
            name: 'grape',
            score: 9,
            review: 'Needs seeds'
          },
          {
            name: 'apple',
            score: 9,
          }
    );
    console.log('Deleted documents =>', deleteResult);

    // Index a Collection
    const indexName = await collection.createIndex(
        {
            name: 1
        },
    );
    console.log('index name =', indexName);

  // the following code examples can be pasted here...

  return 'done.';
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());