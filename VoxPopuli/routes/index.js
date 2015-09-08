var express = require('express');
var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

var router = express.Router();

var mongoose = require('mongoose');
//models

// var Post = mongoose.model('Post'); if you do it this way validations are not used from the model
//everything on the other file does not get used

var Post = mongoose.model('Post');

// var Post = require('../models/Posts.js');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');




var passport = require('passport');

//FINDS THE ID OF A GIVEN POST - THIS IS A MIDDLEWARE FUNCTION
router.param('post', function(req, res, next, id){
  var query = Post.findById(id);

  query.exec(function (err, post){
    if (err) {return next(err); }
    if (!post) { return next(new Error('can\'t find post'));}
    req.post = post;
    return next();
  });
});

// router.post('/posts', auth, function(req, res, next) {
//   var comment = new Comment(req.body);
//   comment.post = req.post;
//   comment.author = req.payload.username;
// });


router.post('/register', function(req, res, next) {
  if(!req.body.username || !req.body.password) {
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var user = new User();

  user.username = req.body.username;

  user.setPassword(req.body.password);
  console.log(req.body.username, req.body.password);
  user.save(function(err) {
    if(err){return next(err); }
    return res.json({token : user.generateJWT()});
  });
});

router.post('/login',function(req, res, next) {
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  passport.authenticate('local', function(err, user, info) {
    if(err){return next(err); }

    if(user) {
      return res.json({token: user.generateJWT()});
    } else {
      console.log(err, user, info);
      return res.status(401).json(info);
    }

  }) (req, res, next);
});

//GETS ALL POSTS
router.get('/posts', function(req, res, next){
  Post.find(function(err, posts){
    if(err){ return next(err); }
    res.json(posts);
  });
});

//POSTS A NEW post
router.post('/posts', auth, function(req, res, next){
  var post = new Post(req.body);
  console.log(post);
  post.author = req.payload.username;
  post.save(function(err, post){
    if(err){ return res.json(err); }

    // if(err){ return next(err); }
    res.json(post);
  });
});





//UTILIZES THE ABOVE ROUTE TO FIND A GIVEN POST BASED ON ITS ID
// Old Version
// router.get('/posts/:post', function(req, res){
//   res.json(req.post);
// });

// New Version populate methods allows all comments associated with a given post be loaded

router.get('/posts/:post', function(req, res, next){
  req.post.populate('comments', function(err, post) {
    if (err) {return next(err);}
    res.json(post);
  });
});

//Calls on a method from the  PostSchema to upvote a post
router.put('/posts/:post/upvote', auth, function(req, res, next){
  req.post.upvote(function(err, post){
    if (err) {return next(err); }
    console.log(err);
    // console.log('new log on the way');
    // console.log(post);
    // console.log('new log on the way');
    // console.log(res.json(post));
    res.json(post);
  });
});

router.put('/posts/:post/downvote', auth, function(req, res, next){
  req.post.downvote(function(err, post){
    if (err) {return next(err); }
    console.log(err);
    res.json(post);
  });
});



//Allows users to create a comment on a post
router.post('/posts/:post/comments', auth,  function(req, res, next){
  console.log('reaching comments in express routes');

  var comment = new Comment(req.body);
  comment.author = req.payload.username;
  comment.post = req.post;

  comment.save(function(err, comment){
    if(err){ return next(err); }

    req.post.comments.push(comment);
    req.post.save(function(err, post){
      if(err){ return next(err); }
      res.json(comment);
    });
  });
});

//FINDS THE GIVEN COMMENT PRIOR TO UPVOTING THE COMMENT
router.param('comment', function(req, res, next, id){
  console.log('reaching route comment route in express');

  var query = Comment.findById(id);

  query.exec(function (err, post){
    if (err) {return next(err); }
    if (!comment) {return next(new Error('can\'t find comment'));}
    req.comment = comment;
    return next();
  });
});

//WRITE A UPVOTE ON A COMMENT, NEEDS A PARAMS TO FIND RIGHT COMMENT
router.post('/posts/:post/comments/:comment/upvote', auth, function(req, res, next){
  req.comment.upvote(function(err, comment){
    if (err) {return next(err); }
    res.json(post);
  });
});


/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('main express route reached');

  res.render('index', { title: 'Express' });
});


// //logs errors if no routes work
// router.use(function(err, req, res, next) {
//   console.log(err);
//   res.json(err);
// });


module.exports = router;
