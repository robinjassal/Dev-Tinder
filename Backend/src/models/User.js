const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address", value);
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      // enum:{
      //   values:['male','female','other'],
      //   message:`{VALUE} IS NOT VALID `
      // }
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid photo URL", value);
        }
      },
    },
    about: {
      type: String,
      default: "This is a default description of the user",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true },
);

//offloads jwt to mongoose schema

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.SECRET_KEY_JWT, {
    expiresIn: "7d",
  });
  return token;
};

// const User = mongoose.model("User", userSchema);

// module.exports = User;

module.exports = mongoose.model("User", userSchema);
