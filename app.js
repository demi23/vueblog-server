const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');

const passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
const config = require('./config/database');
mongoose.connect(config.database);
let db = mongoose.connection;

db.once('open', function() {
  console.log('Connected to Mongodb');
})

db.on('error', function(err) {
  console.log(err);
});

const app = express();
app.use(session({
  secret: config.database,
  resave: false,
  saveUninitialized: true
}));

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'static')));
require('./config/passport')(passport);

app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next) {
  res.locals.user = req.user || null;
  next();
  console.log( res.locals.user)
 // res.send(res.locals.user)
})

let Article = require('./models/article');
let User= require('./models/user');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
//跨域
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  next();
});
let articles = require('./routes/articles');
app.use('/articles', articles);
let  users = require('./routes/users');
app.use('/users', users);
let varticles = require('./routes/v-articles');
app.use('/varticles', varticles);
app.get('/', function(req, res) {
  Article.find({}, function(err, articles) {
    User.find({}, function(err,users) {
    res.render('articles/index', {
      articles: articles,
      users:users
    });
  });
  });
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.listen(5000, function() {
  console.log("Server started on port 5000...");
})
// const ip='192.168.20.116';
// app.listen(5000,ip,function(err){
//   if(err){
//       console.error(err);
//   }else {
//       console.info("服务器起动成功..");
//   }
// });