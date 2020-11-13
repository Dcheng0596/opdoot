var express = require('express');
var router = express.Router();

let index = require('../controllers/index');
let user = require('../controllers/user');
let post = require('../controllers/post');

const viewed = require('../middleware/viewed');

router.get('/', index.get_index);
router.get('/random_post', index.get_random_post);
router.get('/trending', index.get_trending);
router.get('/trending_post', index.get_trending_post);
router.get('/search', index.get_search);

router.get('/terms', index.get_terms);
router.get('/privacy', index.get_privacy);


router.get('/signup', user.get_signup);
router.post('/signup', user.post_signup);
router.get('/settings', user.get_settings);

router.post('/change_username', user.post_change_username);
router.post('/change_email', user.post_change_email);
router.post('/change_password', user.post_change_password);
router.post('/set_password', user.post_set_password);
router.delete('/delete_account', user.delete_account);

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
router.get('/post/:id/comment', post.get_comment);
router.post('/comment/:id/opdoot', post.post_comment_opdoot);
router.delete('/comment/:id', post.delete_comment);

router.get('/user/:username', viewed, user.get_user)
router.get('/user/:username/posts', viewed, user.get_user)
router.get('/user/:username/opdoots', user.get_opdoot)
router.get('/user/:username/about', user.get_about)
router.get('/user/:username/post/get', user.get_post)
router.get('/user/:username/opdoot/get', user.get_opdoots)
router.put('/user/:username/profile_picture', user.put_profile_picture)
router.put('/user/:username/about', user.put_about)








module.exports = router;
