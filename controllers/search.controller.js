const { response } = require('express');
const { User, Product, Category, Role } = require('../models');
const { isValidObjectId } = require('mongoose');

const allowedCollections = ['users', 'categories', 'products', 'roles'];

const searchUsers = async (term = '', res = response) => {
    const isMongoId = isValidObjectId(term); // true

    if (isMongoId) {
        const user = await User.findById(term);
        return res.json({
            results: user ? [user] : [],
        });
    }

    const regex = new RegExp(term, 'i');

    const users = await User.find({
        $or: [{ name: regex }, { email: regex }],
        $and: [{ status: true }],
    });

    return res.json({
        total: users.length,
        results: users,
    });
};

const searchProducts = async (term = '', res = response) => {
    const isMongoId = isValidObjectId(term); // true

    if (isMongoId) {
        const product = await Product.findById(term)
            .populate('category', 'name')
            .populate('user', 'name');
        return res.json({
            results: product ? [product] : [],
        });
    }

    const regex = new RegExp(term, 'i');

    const products = await Product.find({
        $or: [
            { name: regex },
            { description: regex },
            { model: regex },
            { manufacturer: regex },
        ],
        $and: [{ status: true }],
    })
        .populate('category', 'name')
        .populate('user', 'name');

    return res.json({
        results: products ? [products] : [],
    });
};

const searchCategories = async (term = '', res = response) => {
    const isMongoId = isValidObjectId(term); // true

    if (isMongoId) {
        const category = await Category.findById(term);
        return res.json({
            results: category ? [category] : [],
        });
    }

    const regex = new RegExp(term, 'i');

    const categories = await Category.find({
        $or: [{ name: regex }],
        $and: [{ status: true }],
    });

    return res.json({
        total: categories.length,
        results: categories ? [categories] : [],
    });
};

const searchRoles = async (term = '', res = response) => {
    const isMongoId = isValidObjectId(term); // true

    if (isMongoId) {
        const role = await Role.findById(term);
        return res.json({
            results: role ? [role] : [],
        });
    }

    const regex = new RegExp(term, 'i');

    const roles = await Role.find({
        $or: [{ name: regex }],
        $and: [{ status: true }],
    });

    return res.json({
        total: roles.length,
        results: roles ? [roles] : [],
    });
};

const search = (req, res = response) => {
    const { collection, term } = req.params;

    if (!allowedCollections.includes(collection)) {
        return res.status(400).json({
            msg: `Allowed collections are: ${allowedCollections}`,
        });
    }

    switch (collection) {
        case 'categories':
            searchCategories(term, res);
            break;
        case 'products':
            searchProducts(term, res);
            break;
        case 'roles':
            searchRoles(term, res);
            break;
        case 'users':
            searchUsers(term, res);
            break;
        default:
            res.status(500).json({
                msg: 'I forgot to do this search',
            });
            break;
    }
};

const searchProductsByCategory = async (req, res = response) => {
    const { id } = req.params;

    const products = await Product.find({
        category: id,
        status: true,
    })
        .populate('category', 'name')
        .populate('user', 'name');

    return res.json({
        total: products.length,
        results: products ? [products] : [],
    });
};

module.exports = {
    search,
    searchProductsByCategory,
};
