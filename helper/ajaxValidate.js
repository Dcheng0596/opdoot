let models = require('../db/models');
let validator = require('validator');
const { Op } = require("sequelize");


exports.validateEmail = (errors, email) => {
    return new Promise((resolve, reject) => {
        email = validator.trim(email);
        if (!validator.isEmail(email)) {
            errors["email"] = "Email is invalid or already taken";
            resolve(errors);
        } else {
            return models.User.findOne({
                where: {
                    email: email
                }
            }).then(user => {
                if (user !== null) {
                    errors["email"] = "Email is invalid or already taken";
                } 
                resolve(errors);
            })
        }
    });
}

exports.validateUsername = (errors, username) => {
    return new Promise((resolve, reject) => {
        if (!validator.matches(username, "^[a-zA-Z0-9_]*$")) {
            errors["username"] = "Username can only contain letters and numbers";
            resolve(errors);
        } else if (!validator.isLength(username, {min: 3, max: 20})) {
            errors["username"] = "Username must be between 3 and 20 characters long";
            resolve(errors);
        } else {
            return models.User.findOne({
                where: {
                    username: {
                        [Op.iLike]: username
                    }
                }
            }).then(user => {
                if (user !== null) {
                    errors["username"] = "Username is not available";
                } 
                resolve(errors);
            })
        }
    });
}

exports.validatePassword = (errors, password) => {
    if (!validator.isAscii(password))
        errors["password"] = "Password contains invalid characters";		
	if (!validator.isLength(password, {min: 8, max: 72}))
        errors["password"] = "Password must be between 8 and 72 characters long";;
}