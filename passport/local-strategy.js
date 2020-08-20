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
            return done(null, false, { message: 'Username/Email or password was incorrect'})
        } else if (user.password == null || user.password == undefined) {
            return done(null, false, { message: 'Reset your password'})
        } else if(!validPassword(user, password)) {
            return done(null, false, { message: 'Username/Email or password was incorrect'})
        }
        return done(null, user);
    }).catch(err => {
        done(err, false);
    })
})