let FacebookStrategy = require('passport-facebook').Strategy;
let models = require('../db/models');
let db = require('../db/models/index');
const { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET } = require('../config/facebook')

// Create Facebook profile if one doesnt exist
// If one was created or if existing one is not linked to an account
// then create an User and link the profile to it
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
        let [fbUser, created] = await models.Facebook.findOrCreate({
            where: { id: profile.id },
            transaction: t 
        });

        if(created || fbUser.UserId == null) {
            let email = profile.emails[0].value;
            let username = email.split('@')[0] + Math.floor(Math.random() * (10000 - 1000) + 1000);
            let user = await models.User.create({
                email: email,
                username: username
            }, { transaction: t })
            fbUser.UserId = user.id;
            await fbUser.save({ transaction: t });
            await t.commit();
            cb(null, user);
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

