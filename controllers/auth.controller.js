const { request, response } = require('express');
const User = require('../models/user');
const { generateJWT } = require('../helpers/generate-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req = request, res = response) => {
    const { email, password } = req.body;

    // Verificar si email existe
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({ msg: 'User / Password are not correct' });
    }

    // Verificar si el usuario está activo
    if (!user.status) {
        return res.status(400).json({
            msg: 'User / Password are not correct with status is false',
        });
    }

    // Verificar la contraseña
    const validPassword = user.comparePassword(password);
    if (!validPassword) {
        return res
            .status(400)
            .json({ msg: 'User / Password are not correct' });
    }

    // Generar el JWT
    const token = await generateJWT(user.id);

    try {
        res.json({ user, token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Something went wrong' });
    }
};

const googleSignIn = async (req = request, res = response) => {
    const { id_token } = req.body;

    try {
        const { name, img, email } = await googleVerify(id_token);

        let user = await User.findOne({ email });

        if (!user) {
            // Create user
            const data = {
                name,
                email,
                password: ':P',
                img,
                google: true,
            };

            user = new User(data);
            await user.save();
        }

        if (!user.status) {
            return res.status(401).json({
                msg: 'User blocked',
            });
        }

        // Generar el JWT
        const token = await generateJWT(user.id);

        res.json({ user, token });
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: 'Google token is not valid' });
    }
};

const googleLogout = (req= request, res= response) => {
    res.json({ msg: 'Logout ok' });
}


const renewToken = async (req = request, res = response) => {
    const { user } = req;

    // Generar el JWT
    const token = await generateJWT(user.id);

    res.json({ user, token });
};

module.exports = {
    login,
    googleSignIn,
    googleLogout,
    renewToken,
};
