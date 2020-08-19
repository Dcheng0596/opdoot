
let models = require("../db/models");
let bcrypt = require("bcrypt");
const passport = require('passport');
const setupPassport = require('../passport/setup')(passport);
const {isEmpty} = require('lodash');
const { validateUser } = require('../helper/validate');
const { validateEmail, validateUsername, validatePassword } = require('../helper/ajaxValidate');

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

exports.validate_email = function(req, res, next) {
    let errors = {};
    validateEmail(errors, req.body.input).then(errors => {
        res.json(errors);
    })
}

exports.validate_username = function(req, res, next) {
    let errors = {};
    validateUsername(errors, req.body.input).then(errors => {
        res.json(errors);
    })
}

exports.validate_password = function(req, res, next) {
    let errors = {};
    validatePassword(errors, req.body.input);
    res.json(errors);
}

exports.get_login = function(req, res, next) {
    res.render('user/login', { title: 'Log In | Opdoot' });
}

exports.post_login = function(req, res, next) { 
	passport.authenticate('local', {
		successRedirect: "/",
		failureRedirect: "/login",
		failureFlash: true
	})(req, res, next);
}

exports.get_logout = function(req, res, next) {
    req.logout();
    res.redirect('/');
}