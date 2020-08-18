let models = require('../db/models');

let validator = require('validator');


const validateCreateUserFields = (errors, req) => {
	if (!validator.isEmail(validator.trim(req.body.email)))
        errors["email"] = "Email is invalid or already taken";
    if (validator.isEmpty(req.body.email))
		errors["email"] = "Enter an email";
        
	if (!validator.isAscii(req.body.password))
		errors["password"] = "Password contains invalid characters";		
	if (!validator.isLength(req.body.password, {min: 8, max: 72}))
        errors["password"] = "Password must be between 8 and 72 characters long";
    if (validator.isEmpty(req.body.password))
		errors["password"] = "Enter a password";
    
    if (!validator.isAlphanumeric(req.body.username))
		errors["username"] = "Username can only contain letters and numbers";
    if (!validator.isLength(req.body.username, {min: 4, max: 20}))
        errors["username"] = "Username must be between 4 and 20 characters long";
    if (validator.isEmpty(req.body.username))
		errors["username"] = "Enter an username";
}

exports.validateUser = (errors, req, next) => {
	return new Promise(function(resolve, reject) {
		validateCreateUserFields(errors, req);
		return models.User.findOne({
			where: {
				email: req.body.email
			}
		}).then(user => {
			if (user !== null) {
				errors["email"] = "Email is invalid or already taken";
			} 
            return models.User.findOne({
                 where: {
                    username: req.body.username
                 }
            }).then(user => {
                if(user !== null) {
                    errors["username"] = "Username is not available";
                }
                resolve(errors);
             }).catch(err => {
                 next(err);
             })
		})
	})
}