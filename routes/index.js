var express = require('express');
var router = express.Router();

let index = require('../controllers/index');
let user = require('../controllers/user');

router.get('/', index.get_index);

router.get('/signup', user.get_signup);
router.post('/signup', user.post_signup);

router.post('/signup_ajax/email', user.validate_email);
router.post('/signup_ajax/username', user.validate_username);
router.post('/signup_ajax/password', user.validate_password);

router.get('/login', user.get_login);
router.get('/logout', user.get_logout);

module.exports = router;
