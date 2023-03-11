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

module.exports = {
  addComment
};
