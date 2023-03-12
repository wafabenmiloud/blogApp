const express = require('express');
const app = express();
const router = express.Router();
const multer = require('multer');

const { signupUser, signinUser, logout, authenticateToken } = require('../api/user_api');
const { addPost, updatePost, getPost, getPostByID, deletePost,views,like,dislike } = require('../api/post_api');
const {
    addComment,
    updateComment,
    deleteComment
  } = require('../api/comment_api');
const { addAnswer,updateAnswer,deleteAnswer,getAnswer,addAnsComment,updateAnsComment,deleteAnsComment } = require('../api/answer_api');

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
router.get('/post/:id/views',views)
router.post('/post/:id/like',like)
router.post('/post/:id/dislike',dislike)

router.get('/post', getPost);
router.get('/post/:id', getPostByID);

//comment API
router.post('/comment/:id', addComment);

router.put('/comment/:id', updateComment);
router.delete('/comment/:id', deleteComment);

//answer API
router.post('/answer', addAnswer);

router.put('/answer', updateAnswer);
router.delete('/answer', deleteAnswer);
router.get('/answer', getAnswer);

//answer's comment API
router.post('/anscomment/:id', addAnsComment);
router.put('/anscomment', updateAnsComment);
router.delete('/anscomment', deleteAnsComment);


module.exports = router;

