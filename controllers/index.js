
let sequelize = require("sequelize");
const models = require('../db/models');
const db = require('../db/models/index');

exports.get_index = async function(req, res, next) {
    try {
        let posts = await models.Post.findAll({ order: sequelize.literal('random()'), limit: 2 });

        posts.forEach(element => {
            console.log(element.toJSON());
        });
        res.render('index', { title: 'Opdoot', user: req.user});
    } catch (error) {
        console.log(error);
    }
}