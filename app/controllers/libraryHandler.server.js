'use strict';

const Library = require('../model/library.js');

function libraryHandler () {
  // app.route('/api/books')
  // from $.get()
  this.getBooks = function(req, res) {
    //console.log('getBooks')
    Library
      .find({})
      .exec( (err, books) => {
      if(err) throw err;
      let response = [];
      books.forEach((book, idx) => {
        return response.push(
          { _id         : book._id,
            title       : book.book.title,
            commentcount: book.book.comments.length
          });
      });
      res.json(response);
      });
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
  
  };
  
  // from $.post()
  this.addBook = function(req, res) {
    //console.log('addBook' , req.body, req.path)
    if(req.body.title === "" ) return res.status(500).json({error: 'please enter a title'});
    
    let title = req.body.title.replace(/\b\w/g, (val) => val.toUpperCase());;
    console.log(title)
    Library
      .find({title: title})
      .exec( (err, book) => {
      if(err) throw err;
      
      if(!book.length) {
        let library = new Library();
        
        library.book.title = title;
        library.book.comment = [];
        library.book.commentcount = 0;
        
        library.save(function(err, success) {
          if(err) throw err;
          
          res.json(success);
        }, {new: true});
      
      }
       
      });
      //response will contain new book object including atleast _id and title
  };
  
  // from $.delete()
  this.deleteAllBooks = function(req, res) {
    //console.log('deleteAllBooks')
    Library.remove({}, (err, success) => {
      if(err) throw err;
      res.send('complete delete successful');
    });
     //if successful response will be 'complete delete successful'
  };
  
  //app.route('/api/books/:id')
  this.getBookId = function(req, res) {
    //console.log('getBookId')
    let bookid = req.params.id;
    Library
      .find({_id: bookid})
      .exec( (err, bookid) => {
        if(err) throw err;

        let response = {},
            status;
      
        if(!bookid.length) {
          response = {error: 'No book exists'};
          status = 500;    
        } else {
          response = {
            _id : bookid[0]._id,
            _title: bookid[0].book.title,
            comments: bookid[0].book.comments
          }
          status = 200;
        }
        res.status(status).json(response);
      });    
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
  };
  
  this.addComment = function(req, res) {
    //console.log('addComment')
      let comment = req.body.comment,
          bookid  = req.params.id;
    
    Library
      .findOne({_id: bookid})
      .exec( (err, book) => {
        if(err) throw err;
        
        let response = {};
        
        if(!book) {
          response = {error: 'no book exists'};
        } else {
          let arr = book.book.comments;
          arr.push(comment);
          book.book.commentcount++;
          response = {
            _id : book._id,
            _title: book.book.title,
            comments: book.book.comments
          };          
          
        }
      
        book.save(err => {
          if(err) throw err;
          
        }, {new: true});
      
      res.json(response);
      });     
    
    
      //json res format same as .get  
  };
  
  this.deleteBook = (req, res) => {
    //console.log('deleteBook')
    let bookid = req.params.id;
    Library
      .findOneAndDelete({_id: bookid})
      .exec( (err, book) => {
        if(err) throw err;
        return res.send('delete successful');

      //if successful response will be 'delete successful'    
    });
  
  }
  
};

module.exports = libraryHandler;

/*
  this.viewIssue = (req, res) => {
    var project = req.params['project'] !== '{}' ? req.params: {},
        query   = req.query;
   
    // add regex and options to query
    for(var key in query) {
      var val = query[key];
      val && key !== 'open' 
          && key !== '_id' ? query[key] = { $regex: val, $options: 'i, m'} 
                           : query[key] = val;      
    }
    
    Library 
      .find(project)
      .or([query])
      .select({project: 0})
      .sort({_id: -1})
      .exec( (err, result) => {
        if(err) throw err;
        
        return res.json(result)
      });
  };

	this.submitIssue = function (req, res) {
		Library
			.find({_id: { $gte: 1000 } })
      .sort({_id: -1}) 
			.exec(function (err, result) {      
				if (err) throw err; 
       
        let submit  = new Library(),
            project = req.body,
            id      = result[0]._id + 1;
        
        if( project.issue_title.length == 0 ||
            project.issue_text.length == 0 ||
            project.created_by == 0
          ) {
            return res.send('Missing required fields');
        }
        
        submit._id         = id;
        submit.project     = req.params.project;
        submit.issue_title = project.issue_title;
        submit.issue_text  = project.issue_text;
        submit.created_by  = project.created_by;
        submit.assigned_to = project.assigned_to;
        submit.status_text = project.status_text;
        submit.created_on  = new Date(Date.now()).toString();
        submit.updated_on  = submit.created_on;
        submit.open        = true;
         
        submit.save( err => {
          if(err) return console.error(err);

          Library 
            .find({_id: id}).select({project: 0})
            .exec( (err, result) => {
              if(err) throw err;
              return res.json(result)
          });          
        });    
			})
	};

	this.updateIssue = function (req, res) {   
   let project = req.body,
       conditions = {}, 
       updates = 0;
    
    for(var key in project) {
      var val = project[key];
    
      if(key !== '_id' && val) {     
        conditions[key] = val;
        updates++;
      }  
    }    
    
    if(updates) {
      conditions['updated_on'] = new Date(Date.now()).toString();
    } else {
       return res.send('no updated field sent') ;
    }

		Library
			.findOneAndUpdate({ 
        _id: project._id
        }, 
        conditions // object with fields to be updated
        ,{
        new : true
      })
			.exec(function (err, result) {
          var message;
      
					err || !result ? message = 'could not update ' + project._id 
                         : message = 'successfully updated ' + project._id;
      
					return res.send(message);
				});
	};

	this.deleteIssue = function (req, res) {
    var id = req.body._id;
    // check if id is a number
    if(!Number.isInteger(parseInt(id)) ) return res.send('_id error');
      
		Library
			.findOneAndDelete({_id: id})
			.exec(function (err, result) {
          var message = {};
					err || !result ? message['failed'] = 'could not delete ' + id
                         : message['success'] = 'deleted ' + id;
          
					return res.send(message);
				});
	};

*/