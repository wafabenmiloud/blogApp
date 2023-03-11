const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const CommentSchema = new mongoose.Schema({
  //   commentID: String,
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "posts",
  },
  comment: String,
  created_at: {
    type: Date,
    default: Date.now(),
  },
  author:{type:Schema.Types.ObjectId, ref:'users'},
});

const Comment = model('Comments', CommentSchema);

module.exports = Comment;
