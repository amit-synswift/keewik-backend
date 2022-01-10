const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require("../config/config");

exports.generateEncryptedPassword = function (password) {
    return bcrypt.hashSync(password, 8);
}

exports.generateToken = function (guid) {
    return jwt.sign({ guid: guid }, config.secret, {
        expiresIn: 2592000 // expires in 30 days
    });
}
