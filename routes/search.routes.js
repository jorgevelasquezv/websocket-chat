const { Router } = require('express');
const {
    search,
    searchProductsByCategory,
} = require('../controllers/search.controller');
const { check } = require('express-validator');
const { categoryExists } = require('../helpers/db-validators');
const { validateFields, validateId } = require('../middlewares');

const router = Router();

router.get('/:collection/:term', search);

router.get(
    '/products/category/:id',
    validateId,
    check('id').custom(categoryExists),
    validateFields,
    searchProductsByCategory
);

module.exports = router;
