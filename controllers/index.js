
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

exports.get_search = async function(req, res, next) {
    try {
        let query = req.query.query;

        if(!query) {
            res.json({
                results: []
            })
        }

        let results = await models.User.findAll({
            where: {
                username: {
                    [sequelize.Op.iLike]: query + "%"
                }
            },
            limit: 5
        })

        res.json({
            results: results
        })
    } catch (error) {
        console.log(error);
    }
}

exports.get_terms = async function(req, res, next) {
    res.render('legal/terms', { title: 'Terms and Conditions | Opdoot', user: req.user});
}

exports.get_privacy = async function(req, res, next) {
    res.render('legal/privacy', { title: 'Privacy Policy | Opdoot', user: req.user});
}

