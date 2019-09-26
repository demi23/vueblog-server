const express = require('express');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator/check');
const passport = require('passport');
const jwt = require("jsonwebtoken");
const formidable = require('formidable'); //上传功能的插件
var fs = require("fs");
const path = require('path');
let router = express.Router();
const urlencodedParser = bodyParser.urlencoded({ extended: false })
let Article = require('../models/article');
let Category = require('../models/category');

let User = require('../models/user');

router.get('/', function(req, res) {
  Article.find({}, function(err, article) {
   User.find({}, function(err, user) {
 
    if (err) {
        res.send(err);
        return
    }else {//article结构
        // for (let i = 0; i < data.length; i++) {
        //     data[i]["comments"] = data[i]["comments"].length;
        //     data[i]["content"] = null;
        // }
        res.send({article,user})
    }
  });
});
})
router.get('/category/555', function(req, res) {
  Article.find({}, function(err, article) {
  Category.find({}, function(err, category) {
  
    if (err) {
        res.send(err);
        return
    }else {
       // console.log(category)
        res.send({category,article})
    }
 
}).sort({sort:1});
}).sort({createdAt:1});
});
router.get('/category/:id', function(req, res) {
  Article.find({category:req.params.id}, function(err, article) {
  if (err) {
        res.send(err);
        return
    }else {
       // console.log(category)
        res.send({article})
    }
 

}).sort({createdAt:1});
});
router.post('/newcategory', function(req, res) {

  let obj = {   
    title: req.body.title,
    keywords: req.body.keywords,
    description:req.body.description,
    sort: req.body.sort
  }
  //console.log(obj);

  let category = new Category(req.body);
  //article.author = req.body._id;

  category.save(function(err) {
     if (err) {
      console.log(err);
      return;
   } else {
     
      res.send("分类添加成功")
      // req.flash("success", "Article Added");
      // res.redirect('/')
    }
 })
})
router.post('/image:id', function(req, res,next) {
 // console.log(req.params.id)  
  var form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, '../public/upload/'); //文件保存的临时目录为static文件夹（文件夹不存在会报错，一会接受的file中的path就是这个）
  form.maxFieldsSize = 4 * 1024 * 1024; //用户头像大小限制为最大1M    
  form.keepExtensions = true; //使用文件的原扩展名  
  form.parse(req, function (err, fields, file) {
    var filePath = '';
       //如果提交文件的form中将上传文件的input名设置为tmpFile，就从tmpFile中取上传文件。否则取for in循环第一个上传的文件。
    if (file.tmpFile) {
      filePath = file.tmpFile.path;
    } else {
      for (var key in file) {
        if (file[key].path && filePath === '') {
          filePath = file[key].path;
          break;
        }
      }
    }
       //文件移动的目录文件夹，不存在时创建目标文件夹  
    var targetDir = path.join(__dirname, '../static/uploads');
    // if (!fs.existsSync(targetDir)) {
    //   fs.mkdir(targetDir);
    // }
    var fileExt = filePath.substring(filePath.lastIndexOf('.'));
    if (('.jpg.jpeg.png.gif').indexOf(fileExt.toLowerCase()) === -1) {
      var err = new Error('此文件类型不允许上传');
      res.json({
        code: -1,
        message: '此文件类型不允许上传'
      });
    }else {
      //以当前时间戳对上传文件进行重命名  
      var fileName = new Date().getTime() + fileExt;
      var targetFile = path.join(targetDir, fileName);
      //移动文件
       var userid=req.params.id;
      fs.rename(filePath, targetFile, function (err) {
        if (err) {
          console.info(err);
          res.json({
            code: -1,
            message: '操作失败'
          });
        } else {
          
       //   let query = { _id: req.params.userid }
          User.updateOne({
            '_id': userid
          }, {$set:{
            'portrait': fileName }
          }, (err2, doc2) => {

            //上传成功，返回文件的相对路径  
            // var fileUrl = '/static/upload/' + fileName;
            res.json({
              code: 0,
              fileUrl: fileName
            });
          })

        }
      })
    }
    //判断文件类型是否允许上传  
  })
})
router.get('/new', function(req, res) {
 
  Category.find({}, function(err, category) {
 
    res.send({category});
});
})
router.get('/userinfo/:id',function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err) {
      console.error(err)
      return
     }
    res.send({
      user
    })
  })
})
router.get('/:id', function(req, res) {
  Article.findById(req.params.id, function(err, article) {
    Category.findById(article.category, function(err, category) {
   User.findById(article.author, function(err, user) {
   if (err) {
      console.error(err)
      return
     }
    res.send({
      article,user,category
    })
  })
     
    });
  })
})

router.get('/edit/:id',function(req, res) {

  Article.findById(req.params.id, function(err, article) {
    Category.find({}, function(err, category) {
    //  if(article.author !=req.user._id){
    //    req.flash('danger','mnot authorized');
    //    return res.redirect('/');
       
    //  }
    if (err) {
      console.error(err)
      return
     }
   // console.log( article,category)
     res.send({
    //  title: 'Edit Article',

      article,category
    })
  })
  })
})

router.post('/new', function(req, res) {
 const errors = validationResult(req);
    let createdate= Date.parse(new Date());
   
    let obj = {   
      title: req.body.title,
      body: req.body.body,
      author:req.body.user,
      createdAt: createdate,
      category:req.body. category
    }
    console.log(obj);
    let article = new Article(obj);
    //article.author = req.body._id;
  
    article.save(function(err) {
       if (err) {
        console.log(err);
        return;
     } else {
        res.send("文章添加成功")
        req.flash("success", "Article Added");
        res.redirect('/')
      }
   })
})


router.post('/update/:id', function(req, res) {
 
  let query = { _id: req.params.id }
  Article.update(query, {body:req.body.body,title:req.body.title,  updatedAt: Date.parse(new Date()),category:req.body.category}, function(err) {
    if (err) {
      console.log(err);
      return;
    } else {
      req.flash("success", "Article updated");
      res.redirect('/');
    }
  })
})

router.delete('/:id', function(req, res) {
  // if( !req.user._id){
  //   return res.status(500).send();  
  // }
let query = { _id: req.params.id };
Article.findById(req.params.id,function(err,article){
  // if(article.author!=req.user._id){
  //   res.status(500).send();
  // }else{
    Article.remove(query, function(err) {
      if (err) {
        console.log(err);
      }
    //  res.send({msg:"删除成功"});
    })
     //  }
})
  
})


router.post('/register',  function(req, res) {
//   check('name').isLength({ min: 1 }).withMessage('Name is required'),
//   check('username').isLength({ min: 1 }).withMessage('Username is required'),
//   check('email').isLength({ min: 1 }).withMessage('Email is required'),
//   check('email').isEmail().withMessage('invalid email'),
//   check("password", "invalid password")
//     .isLength({ min: 1 })
//     .custom((value,{req, loc, path}) => {
//         if (value !== req.body.password_confirmation) {
//             // trow error if passwords do not match
//             throw new Error("Passwords don't match");
//         } else {
//             return value;
//         }
//     })
// ], function(req, res) {
//   const errors = validationResult(req);
// let obj = {
           
//   title: req.body.title,
//   body: req.body.body,
//   author:req.body.author,
// }
  // if (!errors.isEmpty()) {
  //   res.render('users/register', {
  //     errors: errors.array()
  //   })
  // } else {
    let user = new User(req.body);
      
    user.save(function(err) {
      if (err) {
        console.log(err);
        return;
      } else {
        console.log("注册成功");
      //  req.flash("success", "User Added");
       // res.redirect('/users/login')
        res.send({'msg':'注册成功'})
      }
     
    })
  })
//})

//登录
router.post('/login', (req, res) => {
 User.find({ username: req.body.username}, (err, docs) => {
  
    if (err) {
        res.send(err);
        return
    }
      if (docs.length < 0) {
        res.send({ 'status': 0, 'msg': '用户名不存在' });
      }
       if(docs[0].password!=req.body.password){
        res.send({ 'status': 0, 'msg': '密码错误' });
       }else{
      let content = { name: req.body.name }; // 要生成token的主题信息
      let secretOrPrivateKey = "123456" // 这是加密的key（密钥）
      let token = jwt.sign(content, secretOrPrivateKey, {
          expiresIn: 60 * 60 * 24  // 24小时过期
       });
      docs[0].token = token;
      User(docs[0]).save(function (err) {
        if (err) {
            res.status(500).send()
            return
        }
        res.send({ 'status': 1, 'msg': '登陆成功','userinfo':docs[0] , 'token': docs[0].token, 'username': docs[0]["username"], 'type': docs[0]["type"], 'nickName': docs[0]["nickName"], 'avatar': docs[0]["avatar"] })
        console.log("登录成功")
      
      })
    }
  })  
    })
    

  
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/users/login');
  console.log("退出")
});
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;