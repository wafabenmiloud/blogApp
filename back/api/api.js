const dotenv = require('dotenv');
const bcrypt = require ('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const Token = require('../model/token');
const fs = require('fs');
const User = require('../model/user');
const Post = require('../model/post');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));
dotenv.config();

//User API 

const signupUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = { username: req.body.username, email: req.body.email,age:req.body.age, password: hashedPassword };
    const newUser = new User(user);
    newUser.save((err) => {
      if (err) {
        return res.status(500).json({ msg: 'error adding user' });
      }
      return res.status(200).json({ msg: 'user added successfully' });
    });
  } catch (err) {
    return res.status(500).json({ msg: 'error adding user' });
  }
};
const signinUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(400).json({ msg: 'Username does not match' });
    }

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      return res.status(400).json({ msg: 'Password does not match' });
    }

    const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_SECRET_KEY, { expiresIn: '30m' });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_SECRET_KEY);

    await Token.create({ token: refreshToken });

    return res.status(200).json({ accessToken, refreshToken, email: user.email, username: user.username, age:user.age });
  } catch (error) {
    return res.status(500).json({ msg: 'Error while logging in the user' });
  }
};
const authenticateToken = async (req,res,next)=>{
  const authHeader = req.headers['Authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    return res.status(401).json({ msg: 'token is missing' });
}
jwt.verify(token, process.env.ACCESS_SECRET_KEY, (error, user) => {
  if (error) {
      return res.status(403).json({ msg: 'invalid token' })
  }

  req.user = user;
  next();
})
}

const profile = (req,res) => {
  const authHeader = req.headers['Authorization'];

  const token = authHeader && authHeader.split(' ')[1];
  
    jwt.verify(token, process.env.ACCESS_SECRET_KEY, {}, (err,info) => {
      if (err) throw err;
      res.json(info);
    });
  };
const logout = (req,res) => {
    res.cookie('token', '').json('ok');
  };

// Post API
const addPost = async (req,res) => {
    const {originalname,path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path+'.'+ext;
    fs.renameSync(path, newPath);
    const authHeader = req.headers['Authorization'];

    const token = authHeader && authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_SECRET_KEY, {}, async (err,info) => {
      if (err) throw err;
      const {title,summary,content} = req.body;
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover:newPath,
        author:info.id,
      });
      res.json(postDoc);
    });
  
  };
const updatePost = async (req,res) => {
    let newPath = null;
    if (req.file) {
      const {originalname,path} = req.file;
      const parts = originalname.split('.');
      const ext = parts[parts.length - 1];
      newPath = path+'.'+ext;
      fs.renameSync(path, newPath);
    }
    const authHeader = req.headers['Authorization'];

    const token = authHeader && authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_SECRET_KEY, {}, async (err,info) => {
      if (err) throw err;
      const {id,title,summary,content} = req.body;
      const postDoc = await Post.findById(id);
      const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(400).json('you are not the author');
      }
      await postDoc.update({
        title,
        summary,
        content,
        cover: newPath ? newPath : postDoc.cover,
      });
  
      res.json(postDoc);
    });
  
  };
const getPost = async (req,res) => {
    res.json(
      await Post.find()
        .populate('author', ['username'])
        .sort({createdAt: -1})
        .limit(20)
    );
  }
  const getPostByID = async (req, res) => {
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
  }

module.exports = {signupUser,signinUser, profile, logout, addPost, updatePost, getPost,getPostByID};
