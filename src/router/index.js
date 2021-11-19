const express = require('express');
const router = express.Router();

const CheckAuth = require('../middlewares/checkAuthorization');

const { AuthenticateController, PostController } = require('../controllers');

// Authentications routes
router.post('/signup', AuthenticateController.Signup);
router.post('/signin', AuthenticateController.Signin);

// Posts routes
router.get('/user/:userId/posts', CheckAuth, PostController.getUserPosts);
router.get('/post/:postId', CheckAuth, PostController.getPost);
router.get('/post', CheckAuth, PostController.searchPosts);

router.delete('/delete/post/:postId', CheckAuth, PostController.deletePost);
router.patch('/update/post/:postId', CheckAuth, PostController.patchPost);
router.post('/post', CheckAuth, PostController.newPost);

module.exports = router;