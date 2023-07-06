//mongoclient allow to connect 
const { MongoClient } = require("mongodb");

let dbconnection// Declare dbconnection variable

module.exports = {
//establish connection
//cb is a argument 
  connectToDb: (cb) => {
    //conect take a conection string
    MongoClient.connect('mongodb://localhost:27017/bookstore')
    //is a async that return a promise this craete a client
      .then((client) => {
        //method called db in the client method
        dbconnection = client.db();

        return cb(); // Pass dbconnection object as the second argument
      })
      //catch the error if not connected
      .catch(err => {
        console.log(err);
        return cb(err); // Pass error to the callback function
      });
  },
  //functio 2 to return db connection
  getDb: () => dbconnection
};
