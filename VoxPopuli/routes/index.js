var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

var passport = required('passport');
var User = mongoose.mode('User');


router.post('/register', function(req, res, next) {
  if(!req.body.username || !req.body.password) {
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var user = new User();

  user.username = req.body.username;

  user.setPassword(req.body.password)
  user.save(function(err) {
    if(err){return next(err); }
    return res.json({token : user.generateJWT()})
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
router.post('/posts', function(req, res, next){
  var post = new Post(req.body);
  post.save(function(err, post){
    if(err){ return next(err); }
    res.json(post);
  });
});

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
router.put('/posts/:post/upvote', function(req, res, next){
  req.post.upvote(function(err, post){
    if (err) {return next(err); }
    res.json(post);
  });
});

//Allows users to create a comment on a post
router.post('/posts/:post/comments', function(req, res, next){
  var comment = new Comment(req.body);
  comment.post = req.post;

  comment.save(function(err, comment){
    if(err){ return next(err); }

    req.post.comments.push(comment);
    req.post.save(function(err, post){
      if(err){ return next(err); }
    });
  });
});

//FINDS THE GIVEN COMMENT PRIOR TO UPVOTING THE COMMENT
router.param('comment', function(req, res, next, id){
  var query = Comment.findById(id);

  query.exec(function (err, post){
    if (err) {return next(err); }
    if (!comment) {return next(new Error('can\'t find comment'));}
    req.comment = comment;
    return next();
  });
});

//WRITE A UPVOTE ON A COMMENT, NEEDS A PARAMS TO FIND RIGHT COMMENT
router.post('/posts/:post/comments/:comment/upvote', function(req, res, next){
  req.comment.upvote(function(err, comment){
    if (err) {return next(err); }
    res.json(post);
  });
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
