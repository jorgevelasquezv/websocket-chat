const path = require('path');
const { v4: uuidv4 } = require('uuid');

const extensions = ['png', 'jpg', 'jpeg', 'gif'];

const uploadFile = (files, validExtensions = extensions, folder = '') => {
    return new Promise((resolve, reject) => {
        const { file } = files;
        const { name } = file;

        const extension = name.slice(name.lastIndexOf('.') + 1);

        const nameFile = `${uuidv4()}.${extension}`;

        const uploadPath = path.join(__dirname, '../uploads', folder, nameFile);

        if (!validExtensions.includes(extension)) {
            return reject(
                new Error(
                    `Invalid extension ${extension}. Valid extensions are: ${validExtensions}`
                )
            );
        }

        file.mv(uploadPath, err => {
            if (err) reject(new Error(err));
            resolve(nameFile);
        });
    });
};

module.exports = {
    uploadFile,
};
