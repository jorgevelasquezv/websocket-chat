const { Router } = require('express');

const { check } = require('express-validator');

const {
    validateJWT,
    adminRole,
    validateFields,
    validateId,
} = require('../middlewares');

const {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory,
} = require('../controllers/categories.controller');

const {
    categoryExists,
    categoryByNameExists,
} = require('../helpers/db-validators');

const router = Router();

router.get('/', getCategories);

router.get(
    '/:id',
    [validateId, check('id').custom(categoryExists), validateFields],
    getCategory
);

router.post(
    '/',
    [
        validateJWT,
        check('name', 'Name is required').notEmpty(),
        check('name').custom(categoryByNameExists),
        validateFields,
    ],
    createCategory
);

router.put(
    '/:id',
    [
        validateJWT,
        check('name', 'Name is required').notEmpty(),
        check('name').custom(categoryByNameExists),
        validateId,
        check('id').custom(categoryExists),
        validateFields,
    ],
    updateCategory
);

router.delete(
    '/:id',
    [
        validateJWT,
        adminRole,
        validateId,
        check('id').custom(categoryExists),
        validateFields,
    ],
    deleteCategory
);

module.exports = router;
