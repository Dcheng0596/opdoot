let models = require('../db/models');

let local_strategy = require('./local-strategy');
let facebook_strategy = require('./facebook-strategy')

module.exports = passport => {
    passport.serializeUser(function(user, done) {
		done(null, user.id)
	});
	passport.deserializeUser(function(id, done) {
		models.User.findOne({
			where: {
				'id' : id
			}
		}).then(user => {
			if (user == null) {
				done(new Error('Wrong user id'))
			}
			done(null, user);
		})
    });
    passport.use(local_strategy);
    passport.use(facebook_strategy);
}