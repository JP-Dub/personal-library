'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Library = new Schema({
  book : {
    title : String,
    comments : [],
    commentcount : Number 
  },
  totalcount : Number 
});

Library.set( 'toObject', {retainKeyOrder: true});
   
module.exports = mongoose.model('Library', Library);