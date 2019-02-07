'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Library = new Schema({

});

Library.set( 'toObject', {retainKeyOrder: true});
   
module.exports = mongoose.model('Library', Library);