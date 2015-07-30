var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

//GETS ALL POSTS
router.get('/posts', function(req, res, next){
  Post.find(function(err, posts){
    if(err){ return next(err); }
    res.json(posts);
  });
});

//POSTS A NEW post
router.post('/posts', function(req, res, next){
  var post = new Post(req.body);
  post.save(function(err, post){
    if(err){ return next(err); }
    res.json(post);
  });
});

//FINDS THE ID OF A GIVEN POST - THIS IS A MIDDLEWARE FUNCTION
router.param('post', function(req, res, next, id){
  var query = POst.findById(id);

  query.exec(function (err, post){
      if (err) {return next(err); }
      if (!post) { return next(new Error('can\'t find post'));}
      req.post = post;
      return next();
  });
});


//UTILIZES THE ABOVE ROUTE TO FIND A GIVEN POST BASED ON ITS ID
router.get('/posts/:post', function(req, res){
  res.json(req.post);
});





/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
