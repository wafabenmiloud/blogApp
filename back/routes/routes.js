const express = require('express');
const app = express();
const router = express.Router();
const multer = require('multer');

const { signupUser, signinUser, logout, authenticateToken } = require('../api/user_api');
const { addPost, updatePost, getPost, getPostByID, deletePost } = require('../api/post_api');
const { addComment } = require('../api/comment_api');
const { addAnswer } = require('../api/answer_api');

//upload image
app.use('/uploads', express.static(__dirname + '/uploads'));
const uploadMiddleware = multer({ dest: 'uploads/' });


//user API
router.post('/register', signupUser);
router.post('/login', signinUser);
router.get('/logout',logout);
router.get('/loggedIn',authenticateToken);

//post API
router.post('/post', uploadMiddleware.single('file'), addPost);
router.put('/post',uploadMiddleware.single('file'), updatePost);
router.delete('/post/:id',deletePost);
router.get('/post', getPost);
router.get('/post/:id', getPostByID);

//comment API
router.post('/comment/:id', addComment);

//answer API
router.post('/answer', addAnswer);



module.exports = router;

