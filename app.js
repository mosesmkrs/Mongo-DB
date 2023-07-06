const express = require("express");
const app = express();
const { connectToDb, getDb } = require("./db");
const { ObjectId } = require("mongodb");



let db;

// db connection 
connectToDb((err) => {
  if (!err) {
    app.listen(3000, () => {
      console.log("app listening on 3000");
    });
    //return an object that we need
    db = getDb();
  }
});

app.get("/books", (req, res) => {
  //pagination
  const page = req.query.p || 0
  //how many books per page use limit method and skip method
  const booksPerPage = 3

  let books = []; // Initialize an empty array to store books
//refer to collection
  db.collection("books")
  //then we find all documents return a cursor exposes method we can use
    .find()
    .sort({ page: 1 })
    .skip(page * booksPerPage)
    .limit(booksPerPage)
    .forEach(
      (book=> {
        books.push(book); // Push each book to the books array
      })
      .then( () => {
        res.status(200).json(books)
      })
    )
    .catch(() => {
      res.status(500).json({ error: "Could not find documents" });
    });
});

//route 
app.get('/books/:id', (req,res) => {
  if(ObjectId.isValid(req.params.id)) {
    db.collection('books')
    .findOne({_id : ObjectId( req.params.id)})
    .then(doc => {
      res.status(200).json(doc)
    })
    .catch(err => {
      res.status(500).json({error: "colud not fetch doc"})
    })
  }
  else{
    res.status(500).json({error: "not a valied Id"})
  }
 
})

//post request
app.post('/books' ,(req ,res) => {
  const book = req.body

  db.collection('books')
  .insertOne(book)
  .then(result => {
    res.status(201).json(result)
  })
  .catch(err => {
    res.status(500).json({err : 'could not create a new document'})
  })

})


//delete request
app.delete('/books/:id' ,(req , res) => {
    
  if(ObjectId.isValid(req.params.id)) {
    db.collection('books')
    .deleteOne({_id : ObjectId( req.params.id)})
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json({error: "colud not delete document"})
    })
  }
  else{
    res.status(500).json({error: "not a valied Id"})
  }
})

//updating 
app.patch('/books/:id' , (req , res) => {
  const update = req.body
  
  
  if(ObjectId.isValid(req.params.id)) {
    db.collection('books')
    .updateOne({_id : ObjectId( req.params.id)} , {$set: update})
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json({error: "colud not delete document"})
    })
  }
  else{
    res.status(500).json({error: "not a valied Id"})
  }
})

