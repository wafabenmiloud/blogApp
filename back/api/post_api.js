const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");

const Post = require("../model/post");
const Answer = require("../model/Answers");
const Comment = require("../model/Comments");

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
      const { title, summary, content, tags } = req.body;
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: newPath,
        tags,
        author: info.id,
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
      const { id, title, summary, content,tags } = req.body;
      const postDoc = await Post.findById(id);
      const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(400).json("you are not the author");
      }
      await postDoc.updateOne({
        title,
        summary,
        content,
        tags,
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
      .populate("author", ["username","email"])
      .sort({ createdAt: -1 })
      .limit(20)
  );
};
const getPostByID = async (req, res) => {
  const { id } = req.params;

  const postDoc = await Post.findById(id)
    .populate("author", ["username", "email"])
    .lean();

  const comments = await Comment.find({ post_id: id })
    .populate("author", ["username", "email"])
    .sort({ created_at: -1 })
    .lean();

  const answers = await Answer.find({ post_id: id })
    .populate("author", ["username", "email"])
    .sort({ created_at: -1 })
    .lean();

  res.json({
    ...postDoc,
    comments,
    answers,
  });
};

const deletePost = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ errorMessage: "Unauthorized" });

    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
      if (err) throw err;
      const { id} = req.params;
      const postDoc = await Post.findById(id);
      const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(400).json("you are not the author");
      }
      await postDoc.delete();
      res.json({ message: "Post deleted successfully" });

    });

  } catch (err) {
    console.error(err);
    res.status(401).json({ errorMessage: "Unauthorized" });
  }
};
const views = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // Increment views counter
    post.views += 1;
    await post.save();
    res.json(post.views);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}
const like = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ errorMessage: "Unauthorized" });

    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
      if (err) throw err;
    
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const userId = info.id;
    const userLikes = post.likes.indexOf(userId) !== -1;
    const userDislikes = post.dislikes.indexOf(userId) !== -1;
    if (userLikes) {
      post.likes.pull(userId);
    } else {
      if (userDislikes) {
        post.dislikes.pull(userId);
      }
      post.likes.push(userId);
    }
    await post.save();
    res.send(post);
    })
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
const dislike = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ errorMessage: "Unauthorized" });

    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
      if (err) throw err;
     const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const userId = info.id;
    const userLikes = post.likes.indexOf(userId) !== -1;
    const userDislikes = post.dislikes.indexOf(userId) !== -1;

    if (userDislikes) {
      post.dislikes.pull(userId);
    } else {
      if (userLikes) {
        post.likes.pull(userId);
      }
      post.dislikes.push(userId);
    }

    await post.save();
    res.send(post);
    
    })
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
module.exports = {
  addPost,
  updatePost,
  getPost,
  getPostByID,
  deletePost,
  views,
  like,
  dislike
};
