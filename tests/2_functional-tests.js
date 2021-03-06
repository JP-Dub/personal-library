/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
let testBookId;

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
         chai.request(server)
          .post('/api/books/')
          .send({
            title: '1984' 
          })
          .end(function(err, res){
            testBookId = res.body._id;
            assert.equal(res.status, 200);
            assert.isObject(     res.body, 'response should be an object');
            assert.property(res.body.book, 'title', 'returning object should contain title');
            assert.property(     res.body, '_id', 'object should contain unique _id');
            done();
          });
      });
      
      test('Test POST /api/books with no title given', function(done) {
         chai.request(server)
          .post('/api/books/')
          .send({
             title: ''
          })
          .end(function(err, res){
            assert.equal(res.status, 500);
            assert.isObject(   res.body, 'response should be an object');
            assert.property(   res.body, 'error', 'response should contain error');
            assert.propertyVal(res.body, 'error', 'please enter a title');
            done();
          });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
         chai.request(server)
          .get('/api/books/')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(     res.body, 'response should be an array');
            assert.property(res.body[0], 'title', 'response should contain title');
            assert.property(     res.body[0], '_id', 'response should contain _id');
            assert.property(res.body[0], 'commentcount', 'response should contain commentcount');
            done();
          });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
         chai.request(server)
          .get('/api/books/5c5ded599356e4408c87dd11')
          .end(function(err, res){
            assert.equal(res.status, 500);
            assert.isObject(res.body, 'response should be an object');
            assert.property(res.body, 'error', 'response should contain error');
            assert.propertyVal(   res.body, 'error', 'No book exists');
            done();
          });
 
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
         chai.request(server)
          .get('/api/books/' + testBookId)
          .end(function(err, res){
            console.log(res.body)
            assert.equal(res.status, 200);
            assert.isObject(        res.body, 'response should be an object');
            assert.property(        res.body, '_title', 'response should contain title');
            assert.isArray(res.body.comments, 'is an array');
            done();
          });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
         chai.request(server)
          .post('/api/books/' + testBookId)
          .send({
            comment: 'This book practically predicted the future!' 
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isObject(        res.body, 'response should be an object');
            assert.property(        res.body, '_title', 'response should contain title');
            assert.isArray(res.body.comments, 'is an array');
            done();
          });
      });
      
    });
    
    suite('DELETE /api/books/[id] => delete book with id', function(){
      
      test('Test DELETE /api/books/[id]', function(done){
         chai.request(server)
          .delete('/api/books/' + testBookId)
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, 'delete successful');
            done();
          });

      });
      
    });    

  });

});
