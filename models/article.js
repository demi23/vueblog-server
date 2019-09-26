let mongoose = require('mongoose');
let { Schema } = mongoose;
let articleSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  createdAt: {
    type: Number,
    default:Date.parse(new Date()),
  },
  updatedAt: {
    type: Number,
    //default: Date.now,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  }
});

let Article = module.exports = mongoose.model('Article', articleSchema);