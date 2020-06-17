const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const async = require('async');
const dotenv = require('dotenv').config({path: __dirname + '/.env'});

// Connection URL
const url = process.env.MONGODB_URI;

exports.addData = async(data) => {
  console.log("Adding data to cache...");
  
  MongoClient.connect(
    url,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    async function(err, client) {
      const db = client.db('wikidata-cache');    
      //Adding data 
      await db.collection('data').insertOne(data)            
      client.close();                     
    }
  );
}

exports.getData = (query,callback) => {
  var data;
  console.log("Checking data in cache...");

  MongoClient.connect(
    url, 
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    (err, client) => {
      const db = client.db('wikidata-cache');    
      //Fetching data
      db.collection('data').findOne(query, (err, result) => {
        if(err) throw err;
        client.close();
        callback(result);
      });      
    }
  );  
}
  
    
// //Check if data already exists in the DB
// exports.dataExists = async(criteria) => {
//     let doesExist = false;
//     console.log("Checking if data exists in cache...");

//     MongoClient.connect(
//       url, 
//       {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//       }, 
//       async function(err, client) {
//         const db = client.db('wikidata-cache');      
//         doesExist = await db.collection('data').countDocuments(criteria,{ limit: 1}); 
//         console.log(doesExist);       
//         client.close();
//       }
//     );

//     return doesExist;
// }

/* Function to clear the data collection */
exports.clear = async() => {
  console.log("Clearing cache...");

  MongoClient.connect(
    url, 
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, 
    async function(err, client) {
      const db = client.db('wikidata-cache');      
      await db.collection('data').deleteMany({});      
      client.close();
    }
  ); 
}

/* Function to count the number of records in the data collection */
exports.count = (callback) => {
  console.log("Obtaining record count...");

  MongoClient.connect(
    url, 
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, 
    async function(err, client) {
      const db = client.db('wikidata-cache');      
      count = await db.collection('data').countDocuments();      
      client.close();
      callback(count);
    }
  ); 
}
