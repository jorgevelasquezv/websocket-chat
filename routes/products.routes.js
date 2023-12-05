const { Router } = require('express');

const { check } = require('express-validator');
const {
    getProducts,
    getProduct,
    updateProduct,
    createProduct,
    deleteProduct,
} = require('../controllers/products.controller');
const {
    validateId,
    validateFields,
    validateJWT,
    adminRole,
} = require('../middlewares');
const {
    productExists,
    categoryExists,
    productByNameExists,
} = require('../helpers/db-validators');

const router = Router();

router.get('/', getProducts);

router.get(
    '/:id',
    [validateId, check('id').custom(productExists), validateFields],
    getProduct
);

router.post(
    '/',
    [
        validateJWT,
        check('name', 'Name is required').notEmpty(),
        check('name').custom(productByNameExists),
        check('category', 'Category is required').notEmpty(),
        check('category', 'Category is not a valid id').isMongoId(),
        check('category').custom(categoryExists),
        validateFields,
    ],
    createProduct
);

router.put(
    '/:id',
    [
        validateJWT,
        validateId,
        check('id').custom(productExists),
        check('name').custom(productByNameExists),
        validateFields,
    ],
    updateProduct
);

router.delete(
    '/:id',
    [
        validateJWT,
        adminRole,
        validateId,
        check('id').custom(productExists),
        validateFields,
    ],
    deleteProduct
);

module.exports = router;
