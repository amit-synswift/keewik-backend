const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require("../config/config");

exports.generateEncryptedPassword = (password) => {
    return bcrypt.hashSync(password, 8);
}

exports.generateToken = (guid) => {
    return jwt.sign({ guid: guid }, config.secret, {
        expiresIn: 2592000 // expires in 30 days
    });
}

exports.validateString= (string) => {
    if(!string)
        return false;
    return /^([a-zA-Z]{2,255})$/.test(string);
}

exports.validateUsername= (string) => {
    if(!string)
        return false;
    return /^([a-zA-Z._-]{2,255})$/.test(string);
}

exports.validateEmail= (email) => {
    if(!email)
        return false;
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{5,255}))$/.test(email);
}

exports.validatePassword= (password) => {
    if(!password)
        return false;
    return /^(\S)(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹])[a-zA-Z0-9~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]{8,255}$/.test(password);
}
