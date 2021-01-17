const {MongoClient} = require("mongodb")

const url = "mongodb+srv://MarkKleinfelder:DrumPW@drumproject.0iq1i.mongodb.net/drum?retryWrites=true&w=majority"
const client = new MongoClient(url);
const dbName = "drum"

async function run() {
    try {
        await client.connect();
        console.log("CONNECTED TO SERVER");
        // const db = client.db("DrumProject");
        // const col = db.collection("DrumProject");
        // let programs = {
        //     "inst1": [ '1', '0', '0', '0', '0', '0', '0', '0' ],
        //     "inst2": [ '0', '0', '0', '0', '0', '0', '0', '0' ],
        //     "inst3": [ '0', '0', '0', '0', '0', '0', '0', '0' ],
        //     "inst4": [ '0', '0', '0', '1', '0', '0', '0', '0' ],
        //     "inst5": [ '0', '0', '0', '0', '0', '1', '0', '0' ],
        //     "inst6": [ '0', '0', '0', '0', '0', '0', '0', '1' ],
        //     "title": '',
        //     "timeStamp": [ '1/16/2021', '3:49:41 PM' ] 
        // }
        // const prog = await col.insertOne(programs);
        // const myProg = await col.findOne();
        // console.log(myProg);
    } catch (err) {
        console.log(err.stack);
    } finally {
        await client.close();
    }
}

run().catch(console.dir);



// const { MongoClient } = require("mongodb");
// // Replace the uri string with your MongoDB deployment's connection string.
// const uri =
//   "mongodb://MarkKleinfelder:DrumPW@drumproject.0iq1i.mongodb.net/drum?retryWrites=true&w=majority";
// const client = new MongoClient(uri);
// async function run() {
//     console.log("index run()")
//   try {
//       console.log("try")
//     await client.connect();
//     const database = client.db('Drum');
//     const collection = database.collection('DrumProject');
//     // Query for a movie that has the title 'Back to the Future'
//     const query = { title: 'Back to the Future' };
//     const movie = await collection.findOne(query);
//     console.log(movie);
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);








// const mongoose = require('mongoose')

// const url = `mongodb://MarkKleinfelder:DrumPW!@drumproject.0iq1i.mongodb.net/drum?retryWrites=true&w=majority`;

// const connectionParams={
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true 
// }
// mongoose.connect(url,connectionParams)
//     .then( () => {
//         console.log('Connected to database ')
//     })
//     .catch( (err) => {
//         console.error(`Error connecting to the database. \n${err}`);
//     })

// var mongoose = require("mongoose");
// mongoose.connect( process.env.MONGODB_URI|| 
//                   process.env.MONGOLAB_URI || 
//                   process.env.MONGOHQ_URL ||
//                   "mongodb://MarkKleinfelder:DrumPW!@drumproject.0iq1i.mongodb.net/drum?retryWrites=true&w=majority")

// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb://MarkKleinfelder:DrumPW!@drumproject.0iq1i.mongodb.net/drum?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

module.exports.Program = require("./programs.js");