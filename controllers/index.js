
exports.get_index = function(req, res, next) {
    res.render('index', { title: 'Opdoot' });
}

exports.get_signup = function(req, res, next) {
    res.render('signup', { title: 'Sign up | Opdoot' });
}