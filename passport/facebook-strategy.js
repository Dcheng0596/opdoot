let FacebookStrategy = require('passport-facebook').Strategy;
let models = require('../db/models');
let db = require('../db/models/index');
const { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET } = require('../config/facebook')

// Create Facebook profile if one doesnt exist
// If one was created or if existing one is not linked to an account
// Then check if a user exists with the same email as the profile
// If no user has that email create a new user and link it to the profile
// If a user has that email then check if the user already has a profile linked
// If user has a already linked then send flash error message 
// Otherwise link user with profile
// If one was not created and it is linked then sign into that account
module.exports = new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'emails']
  },
  async function(accessToken, refreshToken, profile, cb) {
      let t;
    try {
        t = await db.sequelize.transaction();
        let [fbUser, built] = await models.Facebook.findOrBuild({
            where: { id: profile.id },
            transaction: t 
        });

        if(built || fbUser.UserId == null) {
            let email = profile.emails[0].value;
            let sanitizedEmail = email.split('@')[0].replace(/[^a-zA-Z0-9_]/gi, '');
            let username = sanitizedEmail.substring(0, 16) + Math.floor(Math.random() * (10000 - 1000) + 1000);
            let [user, created] = await models.User.findOrCreate({
                where: { email: email},
                defaults: {
                    username: username
                },
                transaction: t 
            });
            if(created) {
                fbUser.UserId = user.id;
                await fbUser.save({ transaction: t });
                await t.commit();
                cb(null, user);
            } else {
                let linkedFbUser = await models.Facebook.findOne({ where: { UserId: user.id } });
                if( linkedFbUser == null) {
                    fbUser.UserId = user.id;
                    await fbUser.save({ transaction: t });
                    await t.commit();
                    cb(null, user);
                } else {
                    await t.commit();
                    cb(null, false, { message: 'Account with that email already exists'});
                }
            }
        } else {
            let user = await models.User.findByPk(fbUser.UserId);
            await t.commit();
            cb(null, user)
        }
    } catch (error) {
        if(t) {
            await t.rollback();
        }
        cb(error, false);
    }
  }
);

