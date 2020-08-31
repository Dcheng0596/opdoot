const upload = require('../middleware/multer-s3');
const { processTags } = require('../helper/validate-upload');
let models = require('../db/models');
let db = require('../db/models/index');

exports.get_upload = function(req, res, next) {
    if(req.user == null) {
        res.redirect('/')
    }
    res.render('post/upload', { title: 'Upload an image | Opdoot', user: req.user});
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
        } catch (error) {
            if(t) {
                await t.rollback();
            }
            res.status(500);
            res.render('error');
            console.log(error);
            return;
        }
        res.redirect('/');
    })
}

exports.get_post = function(req, res, next) {
    res.render('post/post', { title: 'Post | Opdoot', user: req.user});
}
