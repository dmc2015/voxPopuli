var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
  title: String,
  link: String,
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});


PostSchema.methods.upvote = function(cb){
  this.upvotes +=1;
  this.save(cb);
};

PostSchema.methods.downvote = function(cb){
  this.downvotes +=1;
  this.save(cb);
  console.log(this.downvotes);
};

// mongoose.model('Post', PostSchema);
module.export = mongoose.model('Post', PostSchema);
