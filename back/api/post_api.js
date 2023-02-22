const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");

const Post = require("../model/post");

const addPost = async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);

  try {
    const { token } = req.cookies;
  
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
      if (err) throw err;
      const { title, summary, content } = req.body;
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: newPath,
        author: info.user,
      });
      res.json(postDoc);
    });

  } catch (err) {
    console.error(err);
    res.status(401).json({ errorMessage: "Unauthorized" });
  }
  
};
const updatePost = async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ errorMessage: "Unauthorized" });

    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
      if (err) throw err;
      const { id, title, summary, content } = req.body;
      const postDoc = await Post.findById(id);
      const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.user);
      if (!isAuthor) {
        return res.status(400).json("you are not the author");
      }
      await postDoc.updateOne({
        title,
        summary,
        content,
        cover: newPath ? newPath : postDoc.cover,
      });
  
      res.json(postDoc);

    });

  } catch (err) {
    console.error(err);
    res.status(401).json({ errorMessage: "Unauthorized" });
  }

};
const getPost = async (req, res) => {
  res.json(
    await Post.find()
      .populate("author", ["email"])
      .sort({ createdAt: -1 })
      .limit(20)
  );
};
const getPostByID = async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate("author", ["email"]);
  res.json(postDoc);
};
module.exports = {
  addPost,
  updatePost,
  getPost,
  getPostByID,
};
