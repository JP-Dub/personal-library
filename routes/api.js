/*
*
*
*       Complete the API routing below
*       
*       
*/
      

'use strict';

const path           = process.cwd(),
      LibraryHandler = require(path + '/app/controllers/libraryHandler.server.js');

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;

const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {
  
  let libraryHandler = new LibraryHandler();

  app.route('/api/books')
    .get(libraryHandler.getBooks)
    
    .post(libraryHandler.addBook) 
    
    .delete(libraryHandler.deleteAllBooks);



  app.route('/api/books/:id')
    .get(libraryHandler.getBookId)
    
    .post(libraryHandler.addComment)
    
    .delete(libraryHandler.deleteBook)
  
};
