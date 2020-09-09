const { upload, s3 } = require('../middleware/multer-s3');
const  { S3_BUCKET_URL } = require('../config/amazon.js');
const { processTags } = require('../helper/validate-upload');
const models = require('../db/models');
const db = require('../db/models/index');

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
        if(req.body.height == null && req.body.width == null) {
            res.status(500);
            res.render('error');
            return;
        }
        let t;
        try {
            t = await db.sequelize.transaction();
            let post = await models.Post.create({
                file: req.file.key,
                width: req.body.width,
                height: req.body.height,
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
            res.json({
                url:'/post/' + post.file
            });
        } catch (error) {
            if(t) {
                await t.rollback();
            }
            res.status(500);
            res.json({
                error: 'Upload failed'
            });
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
        if(!req.viewed) {
            await post.increment('views');
        }
        
        let poster = await post.getUser();
        let tags = await post.getTags();
        let opdootType = "novote";
        if(req.user) {
            let postOpdoot = await models.PostOpdoot.findOne({
                where: {
                    UserId: req.user.id,
                    PostId: post.id
                }
            })
            if(!postOpdoot) {
                opdootType = ""
            } else if(postOpdoot.OpdootTypeId == 1) {
                opdootType = "upvote";
            } else if(postOpdoot.OpdootTypeId == 2) {
                opdootType = "downvote";
            } else {
                opdootType = ""
            }
        }
        let comments = await post.getComments();
        let maxImageWidth = 762; //Width of the post-image-container
        let imageRatio = post.height/post.width;

        let containerHeight = post.height;
        let imageWidth = post.width

        if(imageWidth > maxImageWidth) {
            imageWidth = maxImageWidth;
            containerHeight = maxImageWidth * imageRatio;
        }
        res.render('post/post', { 
            title: post.title + ' | Opdoot', 
            user: req.user,
            poster: poster,
            post: post,
            opdootType: opdootType,
            containerHeight: containerHeight,
            imageWidth: imageWidth,
            tags: tags,
            comments: comments,
            url: S3_BUCKET_URL + '/' + req.params.id,
            description: post.description
       });
    } catch (error) {
        console.log(error);
        res.render('404');
    }
}

exports.post_opdoot = async function(req, res, next) {
    try {
        if(!req.body.vote) {
            throw new Error("Missing body keys")
        }
        t = await db.sequelize.transaction();
        let post = await models.Post.findOne({
            where: { file: req.params.id },
            transaction: t
        })
        if(!req.user) {
            throw new Error("User not logged in")
        }
        let user = req.user;
        let hasUser = await post.hasUser(user, { transaction: t });
        if(!hasUser) {
            await post.addUser(user), { transaction: t };
        }
        let postOpdoot = await models.PostOpdoot.findOne({
            where: {
                UserId: user.id,
                PostId: post.id
            }, transaction: t
        })
        if(req.body.vote == "upvote") {
            if(postOpdoot.OpdootTypeId == 1) {
                await post.decrement('opdoots', { transaction: t })
                postOpdoot.OpdootTypeId = null;
            } else if(postOpdoot.OpdootTypeId == 2) {
                await post.increment('opdoots', { by: 2}, { transaction: t })
                postOpdoot.OpdootTypeId = 1;
            } else {
                await post.increment('opdoots', { transaction: t })
                postOpdoot.OpdootTypeId = 1;
            }
        } else if(req.body.vote == "downvote") {
            if(postOpdoot.OpdootTypeId == 2) {
                await post.increment('opdoots', { transaction: t })
                postOpdoot.OpdootTypeId = null;
            } else if(postOpdoot.OpdootTypeId == 1) {
                await post.decrement('opdoots', { by: 2}, { transaction: t })
                postOpdoot.OpdootTypeId = 2;
            } else {
                await post.decrement('opdoots', { transaction: t })
                postOpdoot.OpdootTypeId = 2;
            }
        }
        await postOpdoot.save();
        await t.commit();
        res.render('404');
    } catch (error) {
        if(t) {
            await t.rollback();
        }
        console.log(error);
        res.render('404');
    }  
}

exports.post_comment = async function(req, res, next) {
    try {
        if(!req.body.comment) {
            throw new Error("Missing body keys")
        }
        t = await db.sequelize.transaction();
        let post = await models.Post.findOne({
            where: { file: req.params.id },
            transaction: t
        })
        if(!req.user) {
            throw new Error("User not logged in")
        }
        let user = req.user;
        let comment = await models.Comment.create({
            comment: req.body.comment,
            username: user.username,
            profilePicture: user.profilePicture
        }, { transaction: t })
        await post.addComment(comment, { transaction: t });
        await user.addComment(comment, { transaction: t });
        await post.increment('comments', { transaction: t });
        await t.commit();
    } catch (error) {
        if(t) {
            await t.rollback();
        }
        console.log(error);
        res.render('404');
    }
}