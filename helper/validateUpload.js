
exports.validateUpload = (errors, req) => {
    if(req.file == null) {
        errors["error"] = "Choose a file to upload"
    } else if(req.file.mimetype != "image/jpeg" && req.file.mimetype != "image/png") {
        errors["error"] = "File must be of type JPEG or PNG"
    } else if(req.file.size > 5242880) {
        //Files get compressed to a max of 5MB on the client
        errors["error"] = "File must be 20MB or less"
    }
    if(req.body.title) {
        if(req.body.title.length > 100) 
            errors["error"] = "Title must be 100 characters or less"
    }
    if(req.body.tags) {
        if(req.body.tags.length > 200)
            errors["error"] = "Tags must be 200 charcters or less"
    }
}