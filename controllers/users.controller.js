const { request, response } = require('express');

const User = require('../models/user');

const usersGet = async (req = request, res = response) => {
    const { limit = 5, from = 0 } = req.query;
    const query = { status: true };
    const validLimit = isNaN(limit) ? 5 : Number(limit);
    const validFrom = isNaN(from) ? 0 : Number(from);

    const usersPromise = User.find(query)
        .skip(validFrom)
        .limit(Number(validLimit));
    const totalPromise = User.countDocuments(query);

    const [users, total] = await Promise.all([usersPromise, totalPromise]);

    res.json({ total, users });
};

const usersPost = async (req = request, res = response) => {
    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });

    // Encriptar contraseña
    user.password = user.encryptPassword(password);

    // Guardar en DB
    await user.save();

    res.status(201).json({ msg: 'Hello World', user });
};

const usersPut = async (req = request, res = response) => {
    const { id } = req.params;
    const { _id, password, google, ...rest } = req.body;

    const user = new User({ ...rest });

    if (password) {
        user.password = user.encryptPassword(password);
    }

    const userUpdate = await User.findByIdAndUpdate(id, rest, {new: true});

    res.json({ msg: 'Hello World', user: userUpdate });
};

const usersDelete = async (req = request, res = response) => {
    const { id } = req.params;

    await User.findByIdAndUpdate(id, { status: false });

    res.json({ msg: `User with id: ${id} deleted`});
};

module.exports = {
    usersGet,
    usersPost,
    usersPut,
    usersDelete,
};
