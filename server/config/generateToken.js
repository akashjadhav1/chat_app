const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "30d", // Use "expiresIn" to specify the expiration time
    });
}

module.exports = generateToken;
