var mongoose = require('mongoose'),
    crypto = require('crpto'),
    jwt = require('jsonwebtoken');


var UserSchema = new mongoose.Schema({
  username: {type: String, lowercase: true, unique: true},
  hash: String,
  hash: String,
});

UserSchema.methods.setPassword = function(password) {

  this.salt = crypto.randomBytes(16).toString('hex');

  //crypto pbkdf2Sync is a method that is used as a standard on the net,
  //arguments(userpassword, salt used on password, amount of iterations for the salt, end amount of  characters the hash should contain)
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64)
};

UserSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');

  return this.hash === hash;
};

UserSchema.methods.generateJWT = function() {
  var today = new Date(),
      exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.signin({
    _id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000),
  }, 'SECRET');
};


mongoose.model('User', UserSchema);
