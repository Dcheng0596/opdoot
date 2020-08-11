var express = require('express');
var router = express.Router();

let index = require('../controllers/index');

/* GET home page. */
router.get('/', index.get_index);

/* GET signup page. */
router.get('/signup', index.get_signup);

/* GET login page. */
router.get('/login', index.get_login);

module.exports = router;
