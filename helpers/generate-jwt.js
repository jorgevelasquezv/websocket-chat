const jwt = require('jsonwebtoken');
const { User } = require('../models');

const SECRET = process.env.SECRET_OR_PRIVATEKEY;

const generateJWT = (uid = '') => {
    return new Promise((resolve, reject) => {
        const payload = { uid };

        jwt.sign(
            payload,
            SECRET,
            {
                expiresIn: '4h',
            },
            (err, token) => {
                if (err) {
                    console.log(err);
                    reject(new Error('The token could not be generated'));
                } else {
                    resolve(token);
                }
            }
        );
    });
};

const checkJWT = async (token = '') => {
    try {
        if (token.length < 10) {
            return null;
        }
        const { uid } = jwt.verify(token, SECRET);
        const user = await User.findById(uid);
        if (user?.status) {
            return user;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
};

module.exports = {
    checkJWT,
    generateJWT,
};
