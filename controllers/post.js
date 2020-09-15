const { upload, s3 } = require('../middleware/multer-s3');
const  { S3_BUCKET_URL } = require('../config/amazon.js');
const { processTags } = require('../helper/validate-upload');
const models = require('../db/models');
const db = require('../db/models/index');
const { success } = require('../middleware/passport/local-strategy');
const upvoteId = 1;
const downvoteId = 2;
 
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
            url: S3_BUCKET_URL + '/' + req.params.id,
            description: post.description
       });
    } catch (error) {
        console.log(error);
        res.render('404');
    }
}

exports.post_opdoot = async function(req, res, next) {
    let t;
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
  
        let [postOpdoot, created] = await models.PostOpdoot.findOrBuild({
            where: { UserId: user.id, PostId: post.id},
            transaction: t
        })
        if(req.body.vote == "upvote") {
            if(postOpdoot.OpdootTypeId == upvoteId) {
                await post.decrement('opdoots', { transaction: t })
                postOpdoot.OpdootTypeId = null;
            } else if(postOpdoot.OpdootTypeId == downvoteId) {
                await post.increment('opdoots', { by: 2}, { transaction: t })
                postOpdoot.OpdootTypeId = upvoteId;
            } else {
                await post.increment('opdoots', { transaction: t })
                postOpdoot.OpdootTypeId = upvoteId;
            }
        } else if(req.body.vote == "downvote") {
            if(postOpdoot.OpdootTypeId == downvoteId) {
                await post.increment('opdoots', { transaction: t });
                postOpdoot.OpdootTypeId = null;
            } else if(postOpdoot.OpdootTypeId == 1) {
                await post.decrement('opdoots', { by: 2}, { transaction: t })
                postOpdoot.OpdootTypeId = downvoteId;
            } else {
                await post.decrement('opdoots', { transaction: t })
                postOpdoot.OpdootTypeId = downvoteId;
            }
        }
        postOpdoot.save();
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
    let t;
    try {
        if(!req.body.comment) {
            throw new 
            Error("Missing body keys");
        }
        t = await db.sequelize.transaction();
        let post = await models.Post.findOne({
            where: { file: req.params.id },
            transaction: t
        })
        if(!req.user) {
            throw new Error("User not logged in");
        }
        let user = req.user;
        let parentComment;
        if(req.body.parentId) {
            parentComment = await models.Comment.findOne({
                where: { id: req.body.parentId },
                transaction: t
            })
        }
        let comment = await post.createComment({
            comment: req.body.comment,
            username: user.username,
            profilePicture: user.profilePicture
        }, { transaction: t });
        await user.addComment(comment, { transaction: t });
        if(parentComment) {
            comment.setParent(parentComment, { transaction: t });
            parentComment.increment("replies");
        }
        await post.increment('comments', { transaction: t });
        await t.commit();
        comment = comment.toJSON();
        comment.isUsers = true;
        res.json({ comment: comment });
    } catch (error) {
        if(t) {
            await t.rollback();
        }
        console.log(error);
        res.render('404');
    }
}

exports.get_comment = async function(req, res, next) {
    try {
        if(!req.query.offset || !req.query.offset) {
            throw new Error("Missing query parameters");
        }
        let post = await models.Post.findOne({
            where: { file: req.params.id }
        })
        if(post == null) {
            throw new Error("Post does not exist");
        }
        let parentId = null
        if(req.query.parentId) {
            parentId = req.query.parentId;
        }
        let comments = await post.getComments({
            where: { ParentId: parentId },
            paranoid: false,
            offset: req.query.offset,
            limit: req.query.limit
        });
        for(let i = 0; i < comments.length; i++) {
            let user = req.user;
            comments[i] = comments[i].toJSON();

            if(!user) {
                break;
            };
            user.id == comments[i].UserId ? comments[i].isUsers = true : comments[i].isUsers = false; 
            let commentOpdoot = await models.CommentOpdoot.findOne({
                where: { UserId: user.id, CommentId: comments[i].id}
            })
            if(commentOpdoot == null) {
                continue;
            }
            if(commentOpdoot.OpdootTypeId == null) {
                continue;
            }
            if(commentOpdoot.OpdootTypeId == upvoteId) {
                comments[i].vote = "upvote"
                continue;
            }
            if(commentOpdoot.OpdootTypeId == downvoteId) {
                comments[i].vote = "downvote"
                continue;
            }
        }
        res.json({
            comments: comments
        })
    } catch (error) {
        console.log(error);
        res.json({
            status: "error"
        })
    }
}

exports.post_comment_opdoot = async function(req, res, next) {
    let t;
    try {
        if(!req.body.vote) {
            throw new Error("Missing body keys");
        }
        t = await db.sequelize.transaction();
        let comment = await models.Comment.findOne({
            where: { id: req.params.id },
            transaction: t
        })
        if(!req.user) {
            throw new Error("User not logged in");
        }
        let user = req.user;
  
        let [commentOpdoot, created] = await models.CommentOpdoot.findOrBuild({
            where: { UserId: user.id, CommentId: comment.id},
            transaction: t
        })
        if(req.body.vote == "upvote") {
            if(commentOpdoot.OpdootTypeId == upvoteId) {
                await comment.decrement('opdoots', { transaction: t })
                commentOpdoot.OpdootTypeId = null;
            } else if(commentOpdoot.OpdootTypeId == downvoteId) {
                await comment.increment('opdoots', { by: 2}, { transaction: t })
                commentOpdoot.OpdootTypeId = upvoteId;
            } else {
                await comment.increment('opdoots', { transaction: t })
                commentOpdoot.OpdootTypeId = upvoteId;
            }
        } else if(req.body.vote == "downvote") {
            if(commentOpdoot.OpdootTypeId == downvoteId) {
                await comment.increment('opdoots', { transaction: t });
                commentOpdoot.OpdootTypeId = null;
            } else if(commentOpdoot.OpdootTypeId == 1) {
                await comment.decrement('opdoots', { by: 2}, { transaction: t })
                commentOpdoot.OpdootTypeId = downvoteId;
            } else {
                await comment.decrement('opdoots', { transaction: t })
                commentOpdoot.OpdootTypeId = downvoteId;
            }
        }
        commentOpdoot.save();
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

exports.delete_comment = async function(req, res, next) {
    let t;
    try {
        t = await db.sequelize.transaction();
        let user = req.user;
        if(!user) {
            throw new Error("User not logged in");
        }
        let comment = await models.Comment.findOne({
            where: { 
                id: req.params.id,
                UserId: user.id
            }, transaction: t
        });
        if(!comment) {
            new Error("Comment does not exist")
        };
        let post = await comment.getPost();
        let paranoid = false;
        if(comment.replies == 0) {
            paranoid = true;
            await post.decrement("comments", { transaction: t });
        }
        if(comment.ParentId != null) {
            let parent = await comment.getParent({ transaction: t });
            await parent.decrement("replies", { transaction: t });
        }
        await comment.destroy({ 
            force: paranoid,
            transaction: t
        });
        await t.commit();
        res.send("success")
    } catch (error) {
        if(t) {
            await t.rollback();
        }
        res.render('404');
        console.log(error);
    }
}

