const { request, response } = require('express');

const { Product } = require('../models');

const getProducts = async (req, res) => {
    const { limit = 5, from = 0 } = req.query;
    const query = { status: true };
    const validLimit = isNaN(limit) ? 5 : Number(limit);
    const validFrom = isNaN(from) ? 0 : Number(from);

    const productsPromise = Product.find(query)
        .skip(validFrom)
        .limit(Number(validLimit))
        .populate('user', 'name')
        .populate('category', 'name');
    const totalPromise = Product.countDocuments(query);

    const [products, total] = await Promise.all([
        productsPromise,
        totalPromise,
    ]);

    res.json({ total, products });
};

const getProduct = async (req = request, res = response) => {
    const { id } = req.params;

    const product = await Product.findById(id)
        .populate('user', 'name')
        .populate('category', 'name');

    res.json(product);
};

const createProduct = async (req = request, res = response) => {
    const { status, name, ...rest } = req.body;

    const productDB = await Product.findOne({ name });

    if (productDB) {
        return res.status(400).json({
            msg: `Product ${productDB.name} already exists`,
        });
    }

    const data = {
        name,
        ...rest,
        user: req.user._id,
    };

    const product = new Product(data);

    await product.save();

    res.status(201).json(product);
};

const updateProduct = async (req = request, res = response) => {
    const { id } = req.params;
    const { status, user, ...data } = req.body;

    data.user = req.user._id;

    const product = await Product.findByIdAndUpdate(id, data, {
        new: true,
    })
        .populate('user', 'name')
        .populate('category', 'name');

    res.json(product);
};

const deleteProduct = async (req = request, res = response) => {
    const { id } = req.params;

    await Product.findByIdAndUpdate(id, { status: false });

    res.json({ msg: `Product with id: ${id} deleted` });
};

module.exports = {
    createProduct,
    deleteProduct,
    getProducts,
    getProduct,
    updateProduct,
};
