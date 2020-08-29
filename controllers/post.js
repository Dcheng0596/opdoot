const upload = require('../middleware/multer-s3');



exports.get_upload = function(req, res, next) {
    //if(req.user == null) {
    //    res.redirect()
    //}
    res.render('post/upload', { title: 'Upload an image | Opdoot', user: req.user});
}

exports.post_upload = function(req, res, next) {
    upload.single('file')(req, res, function(err) {
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
        res.redirect('/');
        
    })
}