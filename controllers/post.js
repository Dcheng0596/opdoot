const upload = require('../middleware/multer-s3');
let models = require('../db/models');
let db = require('../db/models/index');

exports.get_upload = function(req, res, next) {
    //if(req.user == null) {
    //    res.redirect()
    //}
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
        let t;
        try {
            t = await db.sequelize.transaction();
            const post = await models.Post.create({
                file: req.file.key,
                title: req.body.title,
                UserId: req.user.id,
              }, { transaction: t });  

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
        console.log("KEY " + req.file.key);
        res.redirect('/');
        
    })
}