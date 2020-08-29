const err = new Error("Invalid Upload");

exports.fileFilter = async (req, file, cb) => {
    if(req.user == null) {
        cb(err);
        return;
    }
    if(file == null) {
        cb(err);
        return;
    }
    if(file.mimetype != "image/jpeg" && file.mimetype != "image/png") {
        cb(err);
        return;
    }
    if(file.size > 10485760) {
        //Files get compressed to a max of 10MB on the client
        cb(err);
        return;
    }
    cb(null, true);
};
