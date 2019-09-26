let mongoose = require('mongoose');

let userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  portrait:{
    type: String,
    required:false
  }
});

let User = module.exports = mongoose.model('User', userSchema);