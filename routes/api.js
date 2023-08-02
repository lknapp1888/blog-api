const express = require('express');
const router = express.Router();

const post_controller = require('../controllers/postController');
const comment_controller = require('../controllers/commentController');
const auth_controller = require('../controllers/authController');

//post api
router.get('/posts', post_controller.getPosts)

router.get('/post/:id', post_controller.getPost);

router.post('/post', post_controller.postPost);

router.put('/post/:id', post_controller.updatePost);

router.delete('/post/:id', post_controller.deletePost);


// comment api
router.post('/post/:id/comment', comment_controller.postComment);

router.delete('/post/:id/comment/:id', comment_controller.deleteComment);

module.exports = router;

// auth api

router.post('/sign-up', auth_controller.signup )

router.post('/log-in', auth_controller.login)

router.post('/log-out', auth_controller.logout)

router.get('/log-in-status', auth_controller.getLogInStatus)