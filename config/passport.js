const passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;


const User=require('../models/user');

module.exports=function(passport){
   
    passport.use(new LocalStrategy(
        function(username, password, done) {
          
          User.findOne({ username: username}, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false, {message:'用户不存在'}); }
            if (user.password != password)  {return done(null, false, {message:'密码错误'}); }
            return done(null, user);
          });
        }
      ));
      passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      passport.deserializeUser(function(id, done) {
        User.findById(id, function (err, user) {
          done(err, user);
        });
      });
    
}


