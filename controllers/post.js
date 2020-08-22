
exports.get_upload = function(req, res, next) {
    if(req.user == null) {
        res.redirect('/');
    }
    res.render('post/upload', { title: 'Upload an image | Opdoot', user: req.user});
}