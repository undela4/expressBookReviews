const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{
  "username":"undela murali",
  "password":"123456"
}];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    //write code to check if username and password match the one we have in records.
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }

}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  try{
          const username = req.body.username;
          const password = req.body.password;
          if (!username || !password) {
              return res.status(404).json({message: "Error logging in"});
          }
        if (authenticatedUser(username,password))
         {
                let accessToken = jwt.sign({
                  data: password
                }, 'access', { expiresIn: 60 * 60 });
                req.session.authorization = {
                  accessToken,username
              }
              return res.status(200).send("User successfully logged in");
          } else
            return res.status(208).json({message: "Invalid Login. Check username and password"});


    }catch(e){
      return res.status(404).json({message: "Error logging in"});
    }

  

});

regd_users.put("/auth/review/:isbn", (req, res) => {

try{
  const isbn = req.params.isbn;
    const { username, content } = req.body;

    // Check if the book with the given ISBN exists in the books dataset
    if (!books[isbn]) {
        return res.status(404).send('Book not found');
    }

    // Check if the book already has reviews
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    // Check if the user already posted a review for this book
    if (books[isbn].reviews[username]) {
        // If user already posted a review, update it
        books[isbn].reviews[username] = { username: username, content: content };
        res.send('Review updated successfully');
    } else {
        // If user hasn't posted a review, add a new review
        books[isbn].reviews[username] = { username: username, content: content };
        res.send({msg:'Review added successfully',data:books[isbn]});
    }

  } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
  }
  

});

regd_users.delete("/auth/review/:isbn", async(req, res) => {
  try{
    const isbn = req.params.isbn;
    const username = req.body.username; // Assuming the username is provided in the request body

    // Check if the book exists in the 'books' object
    if (books[isbn]) {
        // Check if the book has any reviews
        if (Object.keys(books[isbn].reviews).length > 0) {
            // Check if the provided username has posted a review for the book
            if (books[isbn].reviews.hasOwnProperty(username)) {
                // Delete the review
                delete books[isbn].reviews[username];
                res.send({msg:'Review deleted successfully',data:books[isbn]});
            } else {
                res.status(404).send('Review not found for the provided username');
            }
        } else {
            res.status(404).send('No reviews found for this book');
        }
    } else {
        res.status(404).send('Book not found');
    }
    
  }
  catch (err) 
  {
    res.status(500).send('Internal Server Error');
  }

});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
