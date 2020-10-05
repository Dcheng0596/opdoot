
let sequelize = require("sequelize");
const models = require('../db/models');
const db = require('../db/models/index');

exports.get_index = async function(req, res, next) {
    res.render('index', { title: 'Opdoot', user: req.user});
}

exports.get_random_post = async function(req, res, next) {
    try {
        let posts = await models.Post.findAll({ 
            order: sequelize.literal('random()'),
            limit: req.query.limit
        });
        let loggedIn = false;

        if(req.user) {
            loggedIn = true;
        }
        res.json({
            posts: posts,
            loggedIn: loggedIn
        })
    } catch (error) {
        console.log(error);
    }
}

exports.get_trending = async function(req, res, next) {
    res.render('trending', { title: 'Trending | Opdoot', user: req.user});
}

exports.get_trending_post = async function(req, res, next) {
    try {
        let posts = await models.Post.findAll({
            offset: req.query.offset,
            limit: req.query.limit,
            order: [
                ['opdoots', 'DESC'],
            ]
        });
        let loggedIn = false;

        if(req.user) {
            loggedIn = true;
        }
        res.json({
            posts: posts,
            loggedIn: loggedIn
        })
    } catch (error) {
        console.log(error);
    }
}