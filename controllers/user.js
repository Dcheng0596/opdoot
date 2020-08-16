exports.get_signup = function(req, res, next) {
    res.render('user/signup', { title: 'Sign up | Opdoot' });
}

exports.post_signup = function(req, res, next) {
    res.redirect('/')
}

exports.get_login = function(req, res, next) {
    res.render('user/login', { title: 'Log In | Opdoot' });
}