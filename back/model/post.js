const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const PostSchema = new Schema({
  title:String,
  summary:String,
  content:String,
  cover:String,
  author:{type:Schema.Types.ObjectId, ref:'users'},
}, {
  timestamps: true,
});

const Post = model('posts', PostSchema);

module.exports = Post;