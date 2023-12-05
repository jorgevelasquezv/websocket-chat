const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { response, request } = require('express');
const { uploadFile } = require('../helpers');
const { User, Product } = require('../models');

const uploadFiles = async (req = request, res = response) => {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
        res.status(400).json({
            msg: 'No files were uploaded.',
        });
        return;
    }

    try {
        const name = await uploadFile(req.files);
        res.json({
            name,
        });
    } catch ({ message }) {
        res.status(400).json({ message });
    }
};

const updateImage = async (req = request, res = response) => {
    const { id, collection } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `User ${id} does not exist`,
                });
            }
            break;
        case 'products':
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `Product ${id} does not exist`,
                });
            }

            break;

        default:
            return res.status(500).json({
                msg: 'I forgot to validate this',
            });
    }

    // clean previous images
    try {
        const { img } = model;
        const pathImage = path.join(__dirname, '../uploads', collection, img);
        if (fs.existsSync(pathImage)) {
            fs.unlinkSync(pathImage);
        }
    } catch (error) {
        return res.status(500).json({
            msg: 'I forgot to validate this',
        });
    }

    try {
        const name = await uploadFile(req.files, undefined, collection);
        model.img = name;

        await model.save();
        res.json(model);
    } catch ({ message }) {
        res.status(400).json({ msg: message });
    }
};

const updateImageCloudinary = async (req = request, res = response) => {
    const { id, collection } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `User ${id} does not exist`,
                });
            }
            break;
        case 'products':
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `Product ${id} does not exist`,
                });
            }

            break;

        default:
            return res.status(500).json({
                msg: 'I forgot to validate this',
            });
    }

    // clean previous images

    const { img } = model;
    if (img) {
        const nameWithExtension = img.slice(img.lastIndexOf('/') + 1);
        const [public_id] = nameWithExtension.split('.');
        cloudinary.uploader.destroy(public_id);
    }

    const { tempFilePath } = req.files.file;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
    model.img = secure_url;

    await model.save();

    res.json(model);
};

const getImage = async (req = request, res = response) => {
    const { id, collection } = req.params;
    const pathNoImage = path.join(__dirname, '../assets/noimage.jpg');

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                return res.sendFile(pathNoImage);
            }
            break;
        case 'products':
            model = await Product.findById(id);
            if (!model) {
                return res.sendFile(pathNoImage);
            }
            break;
        default:
            return res.status(500).json({
                msg: 'I forgot to validate this',
            });
    }

    try {
        const { img } = model;
        const pathImage = path.join(__dirname, '../uploads', collection, img);
        if (img && fs.existsSync(pathImage)) {
            return res.sendFile(pathImage);
        }
    } catch (error) {
        return res.status(500).json({
            msg: 'I forgot to validate this',
        });
    }

    res.sendFile(pathNoImage);
};

const getImageCloudinary = async (req = request, res = response) => {
    const { id, collection } = req.params;
    const pathNoImage = path.join(__dirname, '../assets/noimage.jpg');

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                return res.sendFile(pathNoImage);
            }
            break;
        case 'products':
            model = await Product.findById(id);
            if (!model) {
                return res.sendFile(pathNoImage);
            }
            break;
        default:
            return res.status(500).json({
                msg: 'I forgot to validate this',
            });
    }

    try {
        const { img } = model;
        if (img) {
            return res.redirect(img);
        }
    } catch (error) {
        return res.status(500).json({
            msg: 'I forgot to validate this',
        });
    }

    res.sendFile(pathNoImage);
};

module.exports = {
    getImage,
    getImageCloudinary,
    uploadFiles,
    updateImage,
    updateImageCloudinary,
};
