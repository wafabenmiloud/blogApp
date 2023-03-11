const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const PostSchema = new Schema({
  title:String,
  summary:String,
  content:String,
  tags: [],
  cover:String,
  author:{type:Schema.Types.ObjectId, ref:'users'},
  comment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comments",
  },
}, {
  timestamps: true,
});

const Post = model('posts', PostSchema);

module.exports = Post;