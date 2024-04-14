const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  try{
    const username = req.body.username;
    const password = req.body.password;

if (username && password) {
  if (!isValid(username)) {
    users.push({"username":username,"password":password});
    return res.status(200).json({message: "User successfully registred. Now you can login"});
  } else {
    return res.status(404).json({message: "User already exists!"});
  }
}
return res.status(404).json({message: "Unable to register user."});
}
catch(err){
    console.log(err);
}
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  try{
    res.send(books);
  }
  catch(err){
    return res.status(500).json({message: err.message});
  }
  
  
});

// Get the book list available in the shop By Promises

// Function to get the list of books available in the shop using Promise callbacks
function getBooks() {
  return new Promise((resolve, reject) => {
      // Simulating an asynchronous operation to fetch books
      setTimeout(() => {
          if (books) {
              resolve(books);
          } else {
              reject(new Error('Failed to fetch books'));
          }
      },1000); // Simulating delay
  });
}
// Route to get the list of books available in the shop
public_users.get('/', (req, res) => {
  getBooks()
      .then((books) => {
          res.send(books);
      })
      .catch((error) => {
          res.status(500).json({ message: error.message });
      });
});



// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  
  res.send(books[req.params.isbn]);

  // return res.status(300).json({message: "Yet to be implemented"});
 });

// Function to get a book by ISBN using Promise callbacks
function getBookByISBN(isbn) {
  return new Promise((resolve, reject) => {
      // Simulating an asynchronous operation to fetch the book by ISBN
      setTimeout(() => {
          if (books[isbn]) {
              resolve(books[isbn]);
          } else {
              reject(new Error('Book not found'));
          }
      }, 1000); // Simulating delay
  });
}
// Route to get a book by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  getBookByISBN(isbn)
      .then((book) => {
          res.send(book);
      })
      .catch((error) => {
          res.status(404).json({ message: error.message });
      });
});





// Get book details based on author

public_users.get('/author/:author',function (req, res) {
    for(let i=1; i<11; i++){
      if(books[i].author === req.params.author){
        res.send(books[i]);
      }
    }
    res.send("Not found")
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Function to get books by author using Promise callbacks
function getBooksByAuthor(author) {
  return new Promise((resolve, reject) => {
      // Simulating an asynchronous operation to filter books by author
      setTimeout(() => {
          const filteredBooks = [];
          for (let i = 1; i < 11; i++) {
              if (books[i].author === author) {
                  filteredBooks.push(books[i]);
              }
          }
          if (filteredBooks.length > 0) {
              resolve(filteredBooks);
          } else {
              reject(new Error('Books by author not found'));
          }
      }, 1000); // Simulating delay
  });
}
// Route to get books by author
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;

  getBooksByAuthor(author)
      .then((books) => {
          res.send(books);
      })
      .catch((error) => {
          res.status(404).json({ message: error.message });
      });
});







// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  for(let i=1; i<11; i++){
    if(books[i].title === req.params.title){
      res.send(books[i]);
    }
  }
  res.send("Not found")
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title By Promises
function getBooksByTitle(title) {
  return new Promise((resolve, reject) => {
      // Simulating an asynchronous operation to filter books by title
      setTimeout(() => {
          const filteredBooks = [];
          for (let i = 1; i < 11; i++) {
              if (books[i].title === title) {
                  filteredBooks.push(books[i]);
              }
          }
          if (filteredBooks.length > 0) {
              resolve(filteredBooks);
          } else {
              reject(new Error('Books by title not found'));
          }
      }, 1000); // Simulating delay
  });
}
// Route to get books by title
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;

  getBooksByTitle(title)
      .then((books) => {
          res.send(books);
      })
      .catch((error) => {
          res.status(404).json({ message: error.message });
      });
});





//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  res.send(books[req.params.isbn].review);

  // return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
