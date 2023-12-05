const jwt = require('jsonwebtoken');
const User = require('../models/user');

const SECRET = process.env.SECRET_OR_PRIVATEKEY;

const validateJWT = async (req, res, next) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            msg: 'There is no token in the request',
        });
    }

    try {
        const { uid } = jwt.verify(token, SECRET);
        req.uid = uid;

        const user = await User.findById(uid);

        if (!user) {
            return res.status(401).json({
                msg: 'Invalid token - user does not exist in BD',
            });
        }

        if (!user.status) {
            return res.status(401).json({
                msg: 'Invalid token - user with status false',
            });
        }

        req.user = user;

        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            msg: 'Invalid token',
        });
    }
};

module.exports = { validateJWT };
