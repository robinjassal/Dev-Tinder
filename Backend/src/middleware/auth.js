const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userAuth = async (req, res, next) => {
  try {
    //Read the token request cookie
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Token is not Valid!!!");
    }
    // validate the token
    const decodedObj = await jwt.verify(token, process.env.SECRET_KEY_JWT);

    const { _id } = decodedObj;
    //find the user
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("user not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(404).send("ERROR: " + err.message);
  }
};

module.exports = {
  userAuth,
};
