const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require('express');

const fs = require('fs');
const UserModel = require('../model/user');
const PostModel = require('../model/post');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));
dotenv.config();

const secret = process.env.SECRET;

//User API 

const signupUser = async (req,res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
  
      const user = { username: req.body.username,email: req.body.email,age: req.body.age, password: hashedPassword };
      const newUser = new UserModel(user);
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
const signinUser = async (req,res) => {
    const {username,password} = req.body;
    const userDoc = await UserModel.findOne({username});
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      // logged in
      jwt.sign({username,id:userDoc._id}, secret, {}, (err,token) => {
        if (err) throw err;
        res.cookie('token', token).json({
          id:userDoc._id,
          username,
        });
      });
    } else {
      res.status(400).json('wrong credentials');
    }
  };
const profile = (req,res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err,info) => {
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
  
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err,info) => {
      if (err) throw err;
      const {title,summary,content} = req.body;
      const postDoc = await PostModel.create({
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
  
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err,info) => {
      if (err) throw err;
      const {id,title,summary,content} = req.body;
      const postDoc = await PostModel.findById(id);
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
      await PostModel.find()
        .populate('author', ['username'])
        .sort({createdAt: -1})
        .limit(20)
    );
  }
  const getPostByID = async (req, res) => {
    const {id} = req.params;
    const postDoc = await PostModel.findById(id).populate('author', ['username']);
    res.json(postDoc);
  }

module.exports = {signupUser,signinUser, profile, logout, addPost, updatePost, getPost,getPostByID};
