
const { validateUpload } = require('../helper/validateUpload');

exports.get_upload = function(req, res, next) {
    //if(req.user == null) {
    //    res.redirect()
    //}
    res.render('post/upload', { title: 'Upload an image | Opdoot', user: req.user});
}

exports.post_upload = function(req, res, next) {
    let errors = {};
    
    validateUpload(errors, req);
    console.log(req.file);
    console.log(req.body);
    console.log(errors);
    res.json({ 
        redirect: "/upload",
        error: errors.error
    });
}