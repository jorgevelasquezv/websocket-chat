const { request, response } = require('express');

const adminRole = (req = request, res = response, next) => {
    if (!req.user) {
        return res.status(500).json({
            msg: 'Trying to verify role without validating token first',
        });
    }

    const { role, name } = req.user;

    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${name} is not an admin`,
        });
    }

    next();
};

const hasARole = (...roles) => {
    return (req = request, res = response, next) => {
        if (!req.user) {
            return res.status(500).json({
                msg: 'Trying to verify role without validating token first',
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(401).json({
                msg: `The service requires one of these roles: ${roles}`,
            });
        }

        next();
    };
};

module.exports = {
    adminRole,
    hasARole,
};
