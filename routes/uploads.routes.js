const { Router } = require('express');

const { check } = require('express-validator');
const {
    uploadFiles,
    updateImage,
    getImage,
    updateImageCloudinary,
    getImageCloudinary,
} = require('../controllers/uploads.controller');
const { validCollections } = require('../helpers');
const { validateFileUpload, validateFields } = require('../middlewares');

const router = Router();

router.post('/', validateFileUpload, uploadFiles);

router.put(
    '/:collection/:id',
    [
        check('id', 'The id must be a Mongo ID').isMongoId(),
        check('collection').custom(c =>
            validCollections(c, ['users', 'products'])
        ),
        validateFileUpload,
        validateFields,
    ],
    // updateImage // load image to folder in server 
    updateImageCloudinary //load image to cloudinary server
);

router.get(
    '/:collection/:id',
    [
        check('id', 'The id must be a Mongo ID').isMongoId(),
        check('collection').custom(c =>
            validCollections(c, ['users', 'products'])
        ),
        validateFields,
    ],
    // getImage // get image from folder in server
    getImageCloudinary // get image from cloudinary server
);


module.exports = router;
