let LocalStrategy = require('passport-local').Strategy;

let models = require('../db/models');

const validPassword = (user, password) => {
	return bcrypt.compareSync(password, user.password);
}

module.exports = new LocalStrategy({
    usernameField: 'email', 
    passwordField: 'password',
    passReqToCallback: true
},
(req, email, password, done) => {
    return models.User.findOne({
        where: {
            'email' : email
        },
    }).then(user => {
        if (user == null) {
            req.flash('message', 'The email and/or password you enetered was incorrect')
            return done(null, false)
        } else if (user.password == null || user.password == undefined) {
            req.flash('message', 'You must reset your password')
            return done(null, false)
        } else if(!validPassword(user, password)) {
            req.flash('message', 'The email and/or password you enetered was incorrect')
            return done(null, false)
        }
        return done(null, user);
    }).catch(err => {
        done(err, false);
    })
})