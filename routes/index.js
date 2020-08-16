var express = require('express');
var router = express.Router();

let index = require('../controllers/index');
let user = require('../controllers/user');

/* GET home page. */
router.get('/', index.get_index);

/* GET signup page. */
router.get('/signup', user.get_signup);
router.post('/signup', user.post_signup);

/* GET login page. */
router.get('/login', user.get_login);

module.exports = router;
