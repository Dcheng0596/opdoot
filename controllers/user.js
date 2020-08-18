
let models = require("../db/models");
let bcrypt = require("bcrypt");
const passport = require('passport');
const setupPassport = require('../passport/setup')(passport);
let flash = require('connect-flash');
const {isEmpty} = require('lodash');
const { validateUser } = require('../helper/validate');

exports.get_signup = function(req, res, next) {
    res.render('user/signup', { title: 'Sign up | Opdoot', formData: {}, errors: {}});
}

exports.post_signup = function(req, res, next) {
    let errors = {};
	return validateUser(errors, req, next).then(errors => {
		if (!isEmpty(errors)) {
			res.render('user/signup', { formData: req.body, errors: errors});
		} else {
			return models.User.create({
                email: req.body.email,
                username: req.body.username,
                password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(), null)
            }).then(user => {
                req.login(user, function(err) {
                    if (err) { return next(err); }
                    return res.redirect('/');
                  });
            }).catch(err => {
                if(err.name == 'SequelizeUniqueConstraintError') {
                    res.render('user/signup', { formData: req.body, errors: {email: 'Email or username has already been taken'}});
                } else {
                    next(err);
                }
            })
		}
	})
}

exports.get_login = function(req, res, next) {
    res.render('user/login', { title: 'Log In | Opdoot' });
}