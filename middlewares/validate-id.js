const { default: mongoose } = require("mongoose");

const validateId =async (req, res, next) => {

    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
            msg: `ID ${id} is not valid`,
        });
    }

    next();
}


module.exports = {
    validateId,
}