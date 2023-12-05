const { Category, Product, Role, User } = require('../models');

const isRolValid = async (role = '') => {
    const existRole = await Role.findOne({ role });
    if (!existRole) {
        throw new Error(`Role ${role} does not exist in DB`);
    }
};

const emailExists = async (email = '') => {
    const emailSearch = await User.findOne({ email });
    if (emailSearch) {
        throw new Error(`Email ${email} already exists in DB`);
    }
};

const userExists = async (id = '') => {
    const userSearch = await User.findById(id);
    if (!userSearch) {
        throw new Error(`User ${id} does not exist in DB`);
    }
};

const categoryExists = async (id = '') => {
    const categorySearch = await Category.findById(id);
    if (!categorySearch) {
        throw new Error(`Category ${id} does not exist in DB`);
    }
};

const categoryByNameExists = async (name = '') => {
    const categorySearch = await Category.findOne({name});
    if (!categorySearch) {
        throw new Error(`Category '${name}' exist in DB`);
    }
};

const productExists = async (id = '') => {
    const productSearch = await Product.findById(id);
    if (!productSearch) {
        throw new Error(`Product ${id} does not exist in DB`);
    }
};

const productByNameExists = async (name = '') => {
    const productSearch = await Product.findOne({name});
    if (productSearch) {
        throw new Error(`Product '${name}' exist in DB`);
    }
};

const validCollections = (
    collection = '',
    collections = []
) => {
    const collectionIncluded = collections.includes(collection);
    if (!collectionIncluded) {
        throw new Error(`Collection ${collection} is not allowed, ${collections}`);
    }
    return true;
};

module.exports = {
    categoryByNameExists,
    categoryExists,
    isRolValid,
    emailExists,
    productExists,
    productByNameExists,
    userExists,
    validCollections,
};
