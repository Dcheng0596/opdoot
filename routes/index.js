var express = require('express');
var router = express.Router();

let index = require('../controllers/index');
let user = require('../controllers/user');
let post = require('../controllers/post');

const viewed = require('../middleware/viewed');

router.get('/', index.get_index);

router.get('/signup', user.get_signup);
router.post('/signup', user.post_signup);

router.post('/signup_ajax/email', user.validate_email);
router.post('/signup_ajax/username', user.validate_username);
router.post('/signup_ajax/password', user.validate_password);

router.get('/login', user.get_login);
router.post('/login', user.post_login);
router.get('/logout', user.get_logout);

router.get('/auth/facebook', user.facebook);
router.get('/auth/facebook/callback', user.facebook_cb);

router.get('/auth/google', user.google);
router.get('/auth/google/callback', user.google_cb);

router.get('/upload', post.get_upload);
router.post('/upload', post.post_upload);

router.get('/post/:id', viewed, post.get_post);
router.post('/post/:id/opdoot', post.post_opdoot);
router.post('/post/:id/comment', post.post_comment);



module.exports = router;
