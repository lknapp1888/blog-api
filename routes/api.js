const express = require('express');
const router = express.Router();

const post_controller = require('../controllers/postController');
const comment_controller = require('../controllers/commentController');
const auth_controller = require('../controllers/authController');

//post api
router.get('/posts', post_controller.get_posts)

router.get('/post/:id', post_controller.get_post);

router.post('/post/:id', post_controller.post_post);

router.put('/post/:id', post_controller.update_post);

router.delete('/post/:id', post_controller.delete_post);


// comment api
router.post('/post/:id/comment', comment_controller.post_comment);

router.delete('/post/:id/comment/:id', comment_controller.delete_comment);

module.exports = router;

// auth api

router.post('/sign-up', auth_controller.signup )

router.post('/log-in', auth_controller.login)

router.post('/log-out', auth_controller.logout)

router.get('/log-in-status', auth_controller.getLogInStatus)