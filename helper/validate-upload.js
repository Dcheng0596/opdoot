const err = new Error("Invalid Upload");

exports.fileFilter = (req, file, cb) => {
    if(file == null) {
        cb(err);
    } else if(file.mimetype != "image/jpeg" && file.mimetype != "image/png") {
        cb(err);
    } else if(file.size > 10485760) {
        //Files get compressed to a max of 10MB on the client
        cb(err);
    } else {
        cb(null, true);
    } 
};