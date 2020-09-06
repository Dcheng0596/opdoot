module.exports = function(req, res, next) {
    if(!req.session.viewed) {
        req.session.viewed = [];
    }
    if(!req.session.viewed.includes(req.originalUrl)) {
        req.session.viewed.push(req.originalUrl);
        req.viewed = false;
    } else {
        req.viewed = true;
    }
    next();
}