
exports.get_index = function(req, res, next) {
    res.render('index', { title: 'Express' });
}

exports.get_signup = function(req, res, next) {
    res.render('signup', { title: 'Sign up - Opdoot' });
}