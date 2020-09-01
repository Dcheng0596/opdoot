const { upload, s3 } = require('../middleware/multer-s3');
const  { S3_BUCKET_URL } = require('../config/amazon.js');
const { processTags } = require('../helper/validate-upload');
let models = require('../db/models');
let db = require('../db/models/index');

exports.get_upload = function(req, res, next) {
    if(req.user == null) {
        res.redirect('/')
    }
    res.render('post/upload', { title: 'Upload an image | Opdoot', user: req.user });
}


exports.post_upload = function(req, res, next) {
    upload.single('file')(req, res, async function(err) {
        if(err) {
            res.status(500);
            res.render('error');
            return;
        }
        if(req.body.title) {
            if(req.body.title.length > 100) {
                res.status(500);
                res.render('error');
                return;
            } 
        }     
        if(req.body.tags) {
            if(req.body.tags.length > 200) {
                res.status(500);
                res.render('error');
                return;
            }
        }
        if(req.body.description) {
            if(req.body.description.length > 200) {
                res.status(500);
                res.render('error');
                return;
            }
        }
        let t;
        try {
            t = await db.sequelize.transaction();
            let post = await models.Post.create({
                file: req.file.key,
                title: req.body.title,
                description: req.body.description,
            }, { transaction: t });
            await req.user.addPost(post, { transaction: t});
            for(tag of processTags(req.body.tags)) {
                let [newTag, created] = await models.Tag.findOrCreate({
                    where: {
                        name: tag
                    }, transaction: t
                })
                if(!created) {
                    await newTag.increment('count', { transaction: t })
                }
                await post.addTag(newTag, { transaction: t });
            };
            await t.commit();
            res.redirect('/post/' + post.file);
        } catch (error) {
            if(t) {
                await t.rollback();
            }
            res.status(500);
            res.render('error');
            console.log(error);
            return;
        }
    })
}

exports.get_post = async function(req, res, next) {
    try {
        let post = await models.Post.findOne({ where: { file: req.params.id }});
        if(post == null) {
            throw new Error("Post does not exist");
        }
        res.render('post/post', { 
            title: post.title + ' | Opdoot', 
            user: req.user,
            postTitle: post.title,
            url: S3_BUCKET_URL + '/' + req.params.id,
            description: post.description
       });
    } catch (error) {
        res.render('404');
    }
}
