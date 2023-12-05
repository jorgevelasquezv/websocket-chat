const validateFields = require('../middlewares/validate-fields');
const validateJWT = require('../middlewares/validate-jwt');
const validateRoles = require('../middlewares/validated-roles');
const validateId = require('../middlewares/validate-id');
const validateFileUpload = require('../middlewares/validate-file');

module.exports = {
    ...validateFields,
    ...validateJWT,
    ...validateRoles,
    ...validateId,
    ...validateFileUpload,
};
