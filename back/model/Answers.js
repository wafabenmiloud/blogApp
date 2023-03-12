const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const answerSchema = new mongoose.Schema({
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "posts",
    
  },
  answer: String,
  created_at: {
    type: Date,
    default: Date.now(),
  },
  author:{type:Schema.Types.ObjectId, ref:'users'},
  comment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comments",
  },
});
const Answer = model('Answers', answerSchema);

module.exports = Answer;