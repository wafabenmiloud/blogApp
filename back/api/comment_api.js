const jwt = require("jsonwebtoken");
const Comment = require("../model/Comments");

const addComment = async (req, res) => {
  try {
    const { token } = req.cookies;
  
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
      if (err) throw err;
      const { id } = req.params;
      const commentDoc = await Comment.create({
        post_id: id,
        comment: req.body.comment,
        author: info.id,
      });
      res.json(commentDoc);
    });

  } catch (err) {
    console.error(err);
    res.status(401).json({ errorMessage: "Unauthorized" });
  }
  
};
const updateComment = async (req, res) => {
  try {
    const { token } = req.cookies;
  
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
      if (err) throw err;
      const { id } = req.params;
      const { comment } = req.body;
      const updatedComment = await Comment.findOneAndUpdate(
        { _id: id, author: info.id },
        { comment },
        { new: true }
      );
      if (!updatedComment) {
        res.status(404).json({ errorMessage: "Comment not found" });
      } else {
        res.json(updatedComment);
      }
    });

  } catch (err) {
    console.error(err);
    res.status(401).json({ errorMessage: "Unauthorized" });
  }
  
};
const deleteComment = async (req, res) => {
  try {
    const { token } = req.cookies;
  
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
      if (err) throw err;
      const { id } = req.params;
      const deletedComment = await Comment.findOneAndDelete({ _id: id, author: info.id });
      if (!deletedComment) {
        res.status(404).json({ errorMessage: "Comment not found" });
      } else {
        res.json({ message: "Comment deleted" });
      }
    });

  } catch (err) {
    console.error(err);
    res.status(401).json({ errorMessage: "Unauthorized" });
  }
  
};

module.exports = {
  addComment,
  updateComment,
  deleteComment
};
