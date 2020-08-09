var express = require('express');
var router = express.Router();

let index = require('../controllers/index');

/* GET home page. */
router.get('/', index.get_index);

/* GET signup page. */
router.get('/signup', index.get_signup);

module.exports = router;
