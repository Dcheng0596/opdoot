
exports.get_index = function(req, res, next) {
    res.render('index', { title: 'Opdoot', user: req.user});
}