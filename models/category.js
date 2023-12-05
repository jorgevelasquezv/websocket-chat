const { Schema, model } = require('mongoose');

const CategorySchema = new Schema({
    name: {
        type: String,
        required: [true, 'The name is required.'],
        unique: true,
    },
    img: {
        type: String,
        default: '',
    },
    status: {
        type: Boolean,
        default: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

CategorySchema.methods.toJSON = function () {
    const { __v, _id, status, ...category } = this.toObject();
    category.uid = _id;
    return category;
};

module.exports = model('Category', CategorySchema);
