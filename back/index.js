//packages
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const multer = require('multer');

//import db config and api functions
const Connection = require('./db/db');
const { signupUser, signinUser,addPost, updatePost, getPost, getPostByID } = require('./api/api');

//
const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());

//clien side origin
app.use(cors({credentials:true,origin:'http://localhost:3000'}));

//upload image
const uploadMiddleware = multer({ dest: 'uploads/' });
app.use('/uploads', express.static(__dirname + '/uploads'));

//Database
const mongoURI = process.env.MONGODB_URI;
Connection(mongoURI);

//user API
app.post('/register', signupUser);
app.post('/login', signinUser);

//post API
// app.post('/post', uploadMiddleware.single('file'), addPost);
// app.put('/post',uploadMiddleware.single('file'), updatePost);
app.get('/post', getPost);
app.get('/post/:id', getPostByID)

// server
const PORT = 8000;
app.listen(PORT, () => console.log(`Server is running successfully on PORT ${PORT}`));
