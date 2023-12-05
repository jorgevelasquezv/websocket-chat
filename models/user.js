const { Schema, model } = require("mongoose");
const bcryptjs = require("bcryptjs");

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "The name is required."],
  },
  email: {
    type: String,
    required: [true, "The email is required."],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "The password is required."],
  },
  img: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    required: true,
    enum: ["ADMIN_ROLE", "USER_ROLE"],
    default: "USER_ROLE",
  },
  status: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
});

UserSchema.methods.encryptPassword = function (password) {
  return bcryptjs.hashSync(password, bcryptjs.genSaltSync());
};

UserSchema.methods.comparePassword = function (password) {
    return bcryptjs.compareSync(password, this.password);
};

UserSchema.methods.toJSON = function () { 
  const { __v, password, _id, ...user } = this.toObject();
  user.uid = _id;
  return user;
}

module.exports = model("User", UserSchema);
