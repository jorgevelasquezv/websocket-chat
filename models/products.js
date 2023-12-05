const { Schema, model } = require('mongoose');

const ProductSchema = new Schema({
    name: {
        type: String,
        required: [true, 'The name is required.'],
        unique: true,
    },
    img: {
        type: String,
        default: '',
    },
    price: {
        type: Number,
        default: 0,
    },
    stock: {
        type: Number,
        default: 0,
    },
    description: {
        type: String,
        default: '',
    },
    model: {
        type: String,
        default: '',
    },
    manufacturer: {
        type: String,
        default: '',
    },
    status: {
        type: Boolean,
        default: true,
        required: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    available: {
        type: Boolean,
        default: true,
    },
});

ProductSchema.methods.toJSON = function () {
    const { __v, _id, status, ...product } = this.toObject();
    product.uid = _id;
    return product;
};

module.exports = model('Product', ProductSchema);
