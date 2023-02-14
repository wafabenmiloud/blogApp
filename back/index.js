const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const multer = require('multer');

const Connection = require('./db/db');
const { signupUser, signinUser, profile, logout,addPost, updatePost, getPost, getPostByID } = require('./api/api');

const uploadMiddleware = multer({ dest: 'uploads/' });

const app = express();
dotenv.config();

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());

app.use('/uploads', express.static(__dirname + '/uploads'));

const PORT = 8000;


//Database
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
Connection(username,password);


//user API
app.post('/register', signupUser);
app.post('/login', signinUser);
app.get('/profile', profile);
app.post('/logout', logout);

//post API
app.post('/post', uploadMiddleware.single('file'), addPost);
app.put('/post',uploadMiddleware.single('file'), updatePost);
app.get('/post', getPost);
app.get('/post/:id', getPostByID)

// server
app.listen(PORT, () => console.log(`Server is running successfully on PORT ${PORT}`));
