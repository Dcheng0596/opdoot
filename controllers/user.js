
let sequelize = require("sequelize");
let models = require("../db/models");
let bcrypt = require("bcrypt");
const passport = require('passport');
const setupPassport = require('../middleware/passport/setup')(passport);
const {isEmpty} = require('lodash');
const { validateUser } = require('../helper/validate');
const { validateEmail, validateUsername, validatePassword } = require('../helper/ajax-validate');
const  { S3_BUCKET_URL, S3_BUCKET_NAME } = require('../config/amazon.js');
const { upload_profile_picture, s3 } = require('../middleware/multer-s3');
const moment = require('moment');
const upvoteId = 1;
const downvoteId = 2;

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
        let owner = false;

        if(user) {
            if(user.username == req.params.username) {
                owner = true;
            }
        }
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
            title: profile.username + " | Opdoot",
            user: user,
            owner: owner,
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
        let owner = false;

        if(user) {
            if(user.username == req.params.username) {
                owner = true;
            }
        }
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
            title: profile.username + " | Opdoot",
            user: user,
            owner: owner,
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
        for(let i = 0; i < posts.length; i++) {
            let user = req.user;
            posts[i] = posts[i].toJSON();

            if(!user) {
                break;
            };
            user.id == posts[i].UserId ? posts[i].isUsers = true : posts[i].isUsers = false; 
            let postOpdoot = await models.PostOpdoot.findOne({
                where: { UserId: user.id, PostId: posts[i].id}
            })
            if(postOpdoot == null || postOpdoot.OpdootTypeId == null) {
                continue;
            }
            if(postOpdoot.OpdootTypeId == upvoteId) {
                posts[i].vote = "upvote"
                continue;
            }
            if(postOpdoot.OpdootTypeId == downvoteId) {
                posts[i].vote = "downvote"
                continue;
            }
        }

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
            through: {
                where: {
                    OpdootTypeId: 1
                }
            }
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

exports.get_about = async function(req, res, next) {
    try {
        let user = req.user;
        let owner = false;

        if(user) {
            if(user.username == req.params.username) {
                owner = true;
            }
        }
        let profile = await models.User.findOne({
            where: sequelize.where(
                sequelize.fn('lower', sequelize.col('username')), 
                sequelize.fn('lower', req.params.username)
            )
        })
        if(!profile) {
            throw new Error("User does not exist");
        }

        res.render('user/about', { 
            title: profile.username + " | Opdoot",
            user: user,
            owner: owner,
            profile: profile,
            joined: moment(profile.createdAt).format("MMMM Do YYYY")
        });
    } catch (error) {
        console.log(error);
        res.render('404')
    }
}

exports.put_profile_picture = function(req, res, next) {
    upload_profile_picture.single('file')(req, res, async function(err) {
        try {
            if(err) {
                res.status(500);
                res.render('error');
                return;
            }
            let user = req.user;
            if(!user) {
                throw new Error("User does not exist");
            }
            if(user.username == req.params.username) {
                throw new Error("User does not belong to profile");
            }
            let oldPic = user.profilePicture;
            user.profilePicture = S3_BUCKET_URL + "/" + req.file.key;
            await user.save();
            if(oldPic != S3_BUCKET_URL + "/users/default-user-image.jpg") {
                s3.deleteObject({
                    Bucket: S3_BUCKET_NAME,
                    Key: oldPic.replace(S3_BUCKET_URL + "/", '')
                }, function(err, data) {
                    if(err) {
                        console.log(err, err.stack);
                        throw err
                    }
                })
            }
            res.send("success")
        } catch (error) {
            console.log(error);
            res.send("error")
        }
    })
}

exports.put_about = async function(req, res, next) {
    try {
        let user = req.user;
        if(!user) {
            throw new Error("User does not exist");
        }
        if(user.username == req.params.username) {
            throw new Error("User does not belong to profile");
        }
        user.about = req.body.about;
        await user.save();
        res.send("success")
    } catch (error) {
        console.log(error);
        res.send("error")
    }
}
