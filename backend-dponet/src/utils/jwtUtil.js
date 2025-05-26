const jwt = require('jsonwebtoken');
const { secret, expiresIn } = require('../config/jwt');

exports.gerarToken = (payload) => {
    return jwt.sign(payload, secret, { expiresIn });
};

exports.verificarToken = (token) => {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }
};
