var mongoose = require('mongoose'),
    crypto = require('crypto'),
    jwt = require('jsonwebtoken');


var UserSchema = new mongoose.Schema({
  username: {type: String, lowercase: true, unique: true},
  hash: String,
  salt: String,
});

UserSchema.methods.setPassword = function(password) {

  this.salt = crypto.randomBytes(16).toString('hex');

  //crypto pbkdf2Sync is a method that is used as a standard on the net,
  //arguments(userpassword, salt used on password, amount of iterations for the salt, end amount of  characters the hash should contain)
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  console.log(this.hash, ' passoword:', password);

};

UserSchema.methods.validPassword = function(password) {
  // this.salt = crypto.randomBytes(16).toString('hex');

  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  console.log(hash, ' end of one hash ',this.hash, ' passoword:',password);
  return this.hash === hash;
};

UserSchema.methods.generateJWT = function() {
  var today = new Date(),
      exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    _id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000),
  }, 'SECRET');
};


mongoose.model('User', UserSchema);
