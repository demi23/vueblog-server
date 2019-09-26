const express = require('express');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator/check');
const passport = require('passport');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
let router = express.Router();
let User = require('../models/user');
router.get('/register', function(req, res) {
  res.render('users/register');
});


router.post('/register', [
    check('name').isLength({ min: 1 }).withMessage('Name is required'),
    check('username').isLength({ min: 1 }).withMessage('Username is required'),
    check('email').isLength({ min: 1 }).withMessage('Email is required'),
    check('email').isEmail().withMessage('invalid email'),
    check("password", "invalid password")
      .isLength({ min: 1 })
      .custom((value,{req, loc, path}) => {
          if (value !== req.body.password_confirmation) {
              // trow error if passwords do not match
              throw new Error("Passwords don't match");
          } else {
              return value;
          }
      })
  ], function(req, res) {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      res.render('users/register', {
        errors: errors.array()
      })
    } else {
      let user = new User(req.body);
  
      user.save(function(err) {
        if (err) {
          console.log(err);
          return;
        } else {
          req.flash("success", "User Added");
          res.redirect('/users/login')
        }
      })
    }
  })

  router.get('/login', function(req, res) {
    res.render('users/login');
  });
  router.post('/login', urlencodedParser,function(req, res, next) {
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/users/login',
      failureFlash: true,
      successFlash: 'Welcome!'
    })(req, res, next);

  }); 

  router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/users/login');
  });
  router.get('/:id',function(req, res) {
    User.findById(req.params.id, function(err, users) {
      if (err) {
        console.error(err)
        return
       }
       res.render('users/userinfo', {
        users: users
      });
    })
  })
module.exports = router;
