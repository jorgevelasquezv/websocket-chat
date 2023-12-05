const { Router } = require('express');
const {
    usersGet,
    usersPut,
    usersPost,
    usersDelete,
} = require('../controllers/users.controller');

const { check } = require('express-validator');

const {
    validateFields,
    validateJWT,
    adminRole,
    hasARole,
} = require('../middlewares');

const {
    isRolValid,
    emailExists,
    userExists,
} = require('../helpers/db-validators');

const router = Router();

router.get('/', usersGet);

router.put(
    '/:id',
    [
        check('id', 'Invalid id').isMongoId(),
        check('id').custom(userExists),
        check('role').custom(isRolValid),
        validateFields,
    ],
    usersPut
);

router.post(
    '/',
    [
        check('name', 'name is required').not().isEmpty(),
        check('password', 'password must be more than 6 characters').isLength({
            min: 6,
        }),
        check('email', 'Email is not valid').isEmail(),
        check('email').custom(emailExists),
        // check("role", "Invalid role").isIn(["ADMIN_ROLE", "USER_ROLE"]),
        check('role').custom(isRolValid),

        validateFields,
    ],
    usersPost
);

router.delete(
    '/:id',
    [
        validateJWT,
        // adminRole,
        hasARole('ADMIN_ROLE', 'SALES_ROLE'),
        check('id', 'Invalid id').isMongoId(),
        check('id').custom(userExists),
        validateFields,
    ],
    usersDelete
);

module.exports = router;
