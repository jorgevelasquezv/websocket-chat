const { request, response } = require('express');

const { Category } = require('../models');

const getCategories = async (req, res) => {
    const { limit = 5, from = 0 } = req.query;
    const query = { status: true };
    const validLimit = isNaN(limit) ? 5 : Number(limit);
    const validFrom = isNaN(from) ? 0 : Number(from);

    const categoriesPromise = Category.find(query)
        .skip(validFrom)
        .limit(Number(validLimit))
        .populate('user', 'name');
    const totalPromise = Category.countDocuments(query);

    const [categories, total] = await Promise.all([
        categoriesPromise,
        totalPromise,
    ]);

    res.json({ total, categories });
};

const getCategory = async (req = request, res = response) => {
    const { id } = req.params;

    const category = await Category.findById(id).populate('user', 'name');

    res.json(category);
};

const createCategory = async (req = request, res = response) => {
    const name = req.body.name.toUpperCase();

    const categoryDB = await Category.findOne({ name });

    if (categoryDB) {
        return res.status(400).json({
            msg: `Category ${categoryDB.name} already exists`,
        });
    }

    const data = {
        name,
        user: req.user._id,
    };

    const category = new Category(data);

    await category.save();

    res.status(201).json(category);
};

const updateCategory = async (req = request, res = response) => {
    const { id } = req.params;
    const { status, user, ...data } = req.body;

    data.name = data.name.toUpperCase();
    data.user = req.user._id;

    const category = await Category.findByIdAndUpdate(id, data, {new: true}).populate(
        'user',
        'name'
    );

    res.json(category);
};

const deleteCategory = async (req = request, res = response) => {
    const { id } = req.params;

    await Category.findByIdAndUpdate(id, { status: false });

    res.json({ msg: `Category with id: ${id} deleted` });
};

module.exports = {
    createCategory,
    deleteCategory,
    getCategories,
    getCategory,
    updateCategory,
};
