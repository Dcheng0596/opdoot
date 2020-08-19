let LocalStrategy = require('passport-local').Strategy;
let bcrypt = require('bcrypt');
let models = require('../db/models');
const { Op } = require("sequelize");

const validPassword = (user, password) => {
	return bcrypt.compareSync(password, user.password);
}

module.exports = new LocalStrategy({
    usernameField: 'username-email', 
    passwordField: 'password',
    passReqToCallback: true
},
(req, username_email, password, done) => {
    return models.User.findOne({
        where: {
            [Op.or]: [{ email: username_email }, { username: username_email }]     
        },
    }).then(user => {
        if (user == null) {
            req.flash('message', 'Email and/or password you enetered was incorrect')
            return done(null, false)
        } else if (user.password == null || user.password == undefined) {
            req.flash('message', 'You must reset your password')
            return done(null, false)
        } else if(!validPassword(user, password)) {
            req.flash('message', 'Email and/or password you enetered was incorrect')
            return done(null, false)
        }
        return done(null, user);
    }).catch(err => {
        done(err, false);
    })
})