const jwt = require("jsonwebtoken");
const Answer = require("../model/Answers");

const addAnswer = async (req, res) => {
  try {
    const { token } = req.cookies;
  
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
      if (err) throw err;
      const { id } = req.body.post_id;
      const answerDoc = await Answer.create({
        post_id: id,
        answer: req.body.answer,
        author: info.id,
      });
      res.json(answerDoc);
    });

  } catch (err) {
    console.error(err);
    res.status(401).json({ errorMessage: "Unauthorized" });
  }
  
};

module.exports = {
  addAnswer
};
