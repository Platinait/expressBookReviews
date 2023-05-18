const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Task 10: Using async-await to get the list of books available in the shop
public_users.get('/', async (req, res) => {
    try {
      const bookList = await new Promise((resolve) => {
        setTimeout(() => {
          resolve(books);
        }, 1000);
      });
  
      res.json(bookList);
    } catch (error) {
      res.status(500).json({message: error.message});
    }
  });

  public_users.get('/isbn/:isbn', async (req, res) => {
    try {
      const isbn = req.params.isbn;
      const response = await axios.get(`https://ameya-5000.theiadocker-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books/${isbn}`);
      const book = response.data;
  
      if (book) {
        return res.json(book);
      } else {
        return res.status(404).json({message: "Book not found"});
      }
    } catch (error) {
      res.status(500).json({message: error.message});
    }
  });

  public_users.get('/author/:author', async (req, res) => {
    try {
      const author = req.params.author;
      const response = await axios.get(`https://ameya-5000.theiadocker-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books?author=${author}`);
      const booksByAuthor = response.data;
  
      if (booksByAuthor && booksByAuthor.length > 0) {
        return res.json(booksByAuthor);
      } else {
        return res.status(404).json({message: "No books found by this author"});
      }
    } catch (error) {
      res.status(500).json({message: error.message});
    }
  });

  public_users.get('/title/:title', async (req, res) => {
    try {
      const title = req.params.title;
      const response = await axios.get(`https://ameya-5000.theiadocker-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books?title=${title}`);
      const booksByTitle = response.data;
  
      if (booksByTitle && booksByTitle.length > 0) {
        return res.json(booksByTitle);
      } else {
        return res.status(404).json({message: "No books found with this title"});
      }
    } catch (error) {
      res.status(500).json({message: error.message});
    }
  });

// Remaining part of your code...

module.exports.general = public_users;
