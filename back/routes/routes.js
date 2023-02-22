const express = require('express');
const app = express();
const router = express.Router();

const { signupUser, signinUser, logout, authenticateToken } = require('../api/user_api');
const { addPost, updatePost, getPost, getPostByID } = require('../api/post_api');
//upload image
const multer = require('multer');

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

router.get('/post', getPost);
router.get('/post/:id', getPostByID);

module.exports = router;

