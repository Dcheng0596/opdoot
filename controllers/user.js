
let sequelize = require("sequelize");
let models = require("../db/models");
let bcrypt = require("bcrypt");
const passport = require('passport');
const setupPassport = require('../middleware/passport/setup')(passport);
const {isEmpty} = require('lodash');
const { validateUser } = require('../helper/validate');
const { validateEmail, validateUsername, validatePassword } = require('../helper/ajax-validate');

exports.get_signup = function(req, res, next) {
    res.render('user/signup', { title: 'Sign up | Opdoot', formData: {}, errors: req.flash('error')});
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
                    res.render('user/signup', { formData: req.body, errors: { email: 'Email or username has already been taken' }});
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
    res.render('user/login', { title: 'Log In | Opdoot', errors: req.flash('error')});
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

exports.facebook = function(req, res, next) {
    passport.authenticate('facebook', { scope : ['email'] })(req, res, next)
}

exports.facebook_cb = function(req, res, next) {
    passport.authenticate('facebook', { 
        successRedirect: "/",
        failureRedirect: "/signup",
        failureFlash: true
    })(req, res, next);
}

exports.google = function(req, res, next) {
    passport.authenticate('google', { scope : ['email'] })(req, res, next)
}

exports.google_cb = function(req, res, next) {
    passport.authenticate('google', { 
        successRedirect: "/",
        failureRedirect: "/signup",
        failureFlash: true
    })(req, res, next);
}

exports.get_user = async function(req, res, next) {
    try {
        let user = req.user;
        let profile = await models.User.findOne({
            where: sequelize.where(
                sequelize.fn('lower', sequelize.col('username')), 
                sequelize.fn('lower', req.params.username)
            )
        })
        if(!profile) {
            throw new Error("User does not exist");
        }
        if(!req.viewed) {
            if(req.viewed == req.orginalUrl) {
                await profile.increment("views");
            }
        }
        res.render('user/post', { 
            user: user,
            profile: profile
        });
    } catch (error) {
        console.log(error);
        res.render('404')
    }
}

exports.get_opdoot = async function(req, res, next) {
    try {
        let user = req.user;
        let profile = await models.User.findOne({
            where: sequelize.where(
                sequelize.fn('lower', sequelize.col('username')), 
                sequelize.fn('lower', req.params.username)
            )
        })
        if(!profile) {
            throw new Error("User does not exist");
        }
        res.render('user/opdoot', { 
            user: user,
            profile: profile
        });
    } catch (error) {
        console.log(error);
        res.render('404')
    }
}

exports.get_post = async function(req, res, next) {
    try {
        let user = await models.User.findOne({
            where: sequelize.where(
                sequelize.fn('lower', sequelize.col('username')), 
                sequelize.fn('lower', req.params.username)
            )
        })
        let posts = await user.getPosts({
            offset: req.query.offset,
            limit: req.query.limit
        });

        res.json({
            posts: posts
        })
    } catch (error) {
        console.log(error);
        res.json({
            status: "error"
        })
    }
}

exports.get_opdoots = async function(req, res, next) {
    try {
        let user = await models.User.findOne({
            where: sequelize.where(
                sequelize.fn('lower', sequelize.col('username')), 
                sequelize.fn('lower', req.params.username)
            )
        })
        let posts = await user.getPostOpdoots({
            offset: req.query.offset,
            limit: req.query.limit,
        });
        console.log(posts[0].toJSON());
        res.json({
            posts: posts
        })
    } catch (error) {
        console.log(error);
        res.json({
            status: "error"
        })
    }
}
