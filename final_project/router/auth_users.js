const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const {username, password} = req.body;

    // Check if username exists in the users array
    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(400).json({message: "Invalid username or password"});
    }

    // Check if password matches
    if (user.password !== password) {
        return res.status(400).json({message: "Invalid username or password"});
    }

    // Generate JWT
    const token = jwt.sign({username: user.username}, 'secret', {expiresIn: '1h'});
    res.json({message: "Logged in successfully", token});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const {isbn} = req.params;
    const {review} = req.body;
    const {username} = jwt.verify(req.headers.authorization.split(' ')[1], 'secret');

    // Check if book exists
    const book = books.find(b => b.isbn === isbn);
    if (!book) {
        return res.status(404).json({message: "Book not found"});
    }

    // Add or update review
    book.reviews[username] = review;
    res.json({message: "Review added/updated successfully"});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const {isbn} = req.params;
    const {username} = jwt.verify(req.headers.authorization.split(' ')[1], 'secret');

    // Check if book exists
    const book = books.find(b => b.isbn === isbn);
    if (!book) {
        return res.status(404).json({message: "Book not found"});
    }

    // Check if review exists
    if (!book.reviews[username]) {
        return res.status(404).json({message: "Review not found"});
    }

    // Delete review
    delete book.reviews[username];
    res.json({message: "Review deleted successfully"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
